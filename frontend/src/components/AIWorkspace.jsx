import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './AIWorkspace.css';

const API = process.env.REACT_APP_API_URL || '/api';

const DEFAULT_WELCOME = {
  id: 'msg_welcome',
  sender: 'gemini',
  mode: { key: 'general', name: 'Premium AI Workspace', icon: '🤖', description: 'Intelligent Productivity Assistant' },
  text: `👋 **Welcome to your Premium Gemini AI Workspace!**

I am your multi-purpose intelligence engine. I can help you **write, code, learn, research, analyze documents, plan projects, debug errors, and optimize your career**.

✨ **Automatic Smart Modes:**
I automatically detect your intent and switch between specialized modes (Writing, Coding, Study, Resume, Business, UI/UX, Data Analysis, Translation, and more).

💡 **Quick Start Suggestions:**
• *Write a high-converting email to pitch a new software product.*
• *Build a Flutter app layout with floating navigation and dark mode.*
• *Explain Quantum Computing concepts step-by-step for a beginner.*
• *Upload a PDF/TXT or screenshot using the 📎 / 📷 icons below to analyze documents instantly!*`,
  suggestedFollowUps: [
    "💻 Build a React state component example",
    "📝 Write a professional resume summary",
    "📚 Generate 5 practice quiz questions"
  ]
};

export default function AIWorkspace({
  onClose,
  soundEnabled = true,
  currentPage = 'home',
  selectedTrendingJob = null,
  initialPrompt = '',
  onClearInitialPrompt,
  isPageMode = false
}) {
  // Session / Chat History state
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_ai_workspace_chats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'chat_default',
        title: 'New Conversation',
        pinned: false,
        updatedAt: Date.now(),
        messages: [DEFAULT_WELCOME]
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      const lastId = localStorage.getItem('cp_ai_active_chat_id');
      if (lastId && chats.some(c => c.id === lastId)) return lastId;
    } catch (e) {}
    return chats[0]?.id || 'chat_default';
  });

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isPageMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Save chats to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cp_ai_workspace_chats', JSON.stringify(chats));
      localStorage.setItem('cp_ai_active_chat_id', activeChatId);
    } catch (e) {
      console.warn("Could not save AI workspace chat history:", e);
    }
  }, [chats, activeChatId]);

  // Handle initial prompt passed from app
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      if (typeof onClearInitialPrompt === 'function') {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId, loading]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const activeMessages = activeChat ? activeChat.messages : [DEFAULT_WELCOME];
  const currentMode = activeMessages.slice().reverse().find(m => m.mode)?.mode || DEFAULT_WELCOME.mode;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const playClickSound = () => {
    if (soundEnabled && typeof window !== 'undefined') {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {}
    }
  };

  // Chat management methods
  const handleCreateNewChat = () => {
    playClickSound();
    const newId = 'chat_' + Date.now();
    const newChat = {
      id: newId,
      title: 'New Conversation',
      pinned: false,
      updatedAt: Date.now(),
      messages: [
        {
          ...DEFAULT_WELCOME,
          id: 'msg_' + Date.now()
        }
      ]
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    playClickSound();
    if (chats.length <= 1) {
      showToast("Cannot delete the only active chat session");
      return;
    }
    const filtered = chats.filter(c => c.id !== chatId);
    setChats(filtered);
    if (activeChatId === chatId) {
      setActiveChatId(filtered[0].id);
    }
    showToast("Chat deleted");
  };

  const handleTogglePin = (e, chatId) => {
    e.stopPropagation();
    playClickSound();
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c));
  };

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleSaveRename = (chatId) => {
    if (editingTitle.trim()) {
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: editingTitle.trim() } : c));
    }
    setEditingChatId(null);
  };

  const handleExportChat = (chatToExport = activeChat) => {
    playClickSound();
    const markdownContent = chatToExport.messages.map(m => `### ${m.sender === 'user' ? '👤 User' : '🤖 Gemini AI'}\n\n${m.text}\n\n---`).join('\n\n');
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatToExport.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Chat exported as Markdown file!");
  };

  // Compile screen context for multicontext AI queries
  const compileScreenContext = () => {
    try {
      const headings = [];
      document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
        if (el.innerText) headings.push(el.innerText.trim());
      });
      return {
        currentPage: currentPage || 'home',
        selectedTrendingJob: selectedTrendingJob ? selectedTrendingJob.title : 'None',
        headings: headings.slice(0, 10)
      };
    } catch (e) {
      return { currentPage: currentPage || 'home' };
    }
  };

  // Core Send Message Handler
  const handleSend = async (forcedPrompt = null, customAction = null) => {
    let userMessage = forcedPrompt || prompt.trim();
    if (!userMessage && !attachedFile) return;

    if (!userMessage && attachedFile) {
      userMessage = `Please analyze this attached file (${attachedFile.name}) and summarize its contents.`;
    }

    playClickSound();
    setPrompt('');
    const filePayload = attachedFile;
    setAttachedFile(null);

    const userMsgObj = {
      id: 'msg_u_' + Date.now(),
      sender: 'user',
      text: userMessage,
      file: filePayload
    };

    // Update active chat with user message
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const isFirstUserMsg = c.messages.length <= 1;
        const newTitle = isFirstUserMsg ? (userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '')) : c.title;
        return {
          ...c,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...c.messages, userMsgObj]
        };
      }
      return c;
    }));

    setLoading(true);

    const historyPayload = activeMessages.filter(m => m.id !== 'msg_welcome').map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    const screenContext = compileScreenContext();

    try {
      const response = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload,
          screenContext,
          image: filePayload,
          customAction
        })
      });

      const data = await response.json();
      if (data.success && data.response) {
        const aiMsgObj = {
          id: 'msg_ai_' + Date.now(),
          sender: 'gemini',
          mode: data.mode || { key: 'writing', name: 'Writing Assistant', icon: '✍️' },
          text: data.response,
          suggestedFollowUps: data.suggestedFollowUps || []
        };

        setChats(prev => prev.map(c => {
          if (c.id === activeChatId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, aiMsgObj]
            };
          }
          return c;
        }));
      } else {
        throw new Error(data.error || 'Invalid API response format');
      }
    } catch (err) {
      console.error("Chat API Error:", err);
      const errorMsgObj = {
        id: 'msg_err_' + Date.now(),
        sender: 'gemini',
        mode: { key: 'error', name: 'System Notice', icon: '⚠️' },
        text: `🎯 **Connection Status Update**\n\nI was unable to process your request via live Gemini models.\n\n📖 **Details:** ${err.message}\n\n💡 **Action:** Please check if the backend server is running and your \`GEMINI_API_KEY\` in \`backend/.env\` is active.`
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            updatedAt: Date.now(),
            messages: [...c.messages, errorMsgObj]
          };
        }
        return c;
      }));
    }

    setLoading(false);
  };

  // Screen Capture Analysis
  const handleScreenshot = async () => {
    setLoading(true);
    playClickSound();
    try {
      const container = document.querySelector('.ai-workspace-overlay-wrapper') || document.querySelector('.ai-workspace-container');
      if (container) container.style.display = 'none';

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0d1527'
      });

      if (container) container.style.display = 'flex';

      const base64Str = canvas.toDataURL('image/jpeg', 0.7);
      setAttachedFile({
        base64: base64Str.split(',')[1],
        mimeType: 'image/jpeg',
        name: 'screen_capture.jpg'
      });
      showToast("Screen captured! Type your prompt or click Send to analyze.");
    } catch (e) {
      console.error("Screenshot capture error:", e);
      showToast("Could not capture screen.");
    }
    setLoading(false);
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    playClickSound();
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        base64: reader.result.split(',')[1],
        mimeType: file.type || 'text/plain',
        name: file.name
      });
      showToast(`Attached file: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Copy text helper
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    playClickSound();
    showToast("Copied to clipboard!");
  };

  // Quick action triggered on AI message
  const handleQuickAction = (actionType, messageText) => {
    let promptMsg = '';
    switch (actionType) {
      case 'Rewrite': promptMsg = `Rewrite this text in a clear, polished tone:\n\n${messageText}`; break;
      case 'Summarize': promptMsg = `Summarize the following content into concise bullet points:\n\n${messageText}`; break;
      case 'Explain': promptMsg = `Explain the following concepts in simple terms with examples:\n\n${messageText}`; break;
      case 'Expand': promptMsg = `Expand on the following details with more depth and actionable examples:\n\n${messageText}`; break;
      case 'Shorten': promptMsg = `Make the following text much shorter and to the point:\n\n${messageText}`; break;
      case 'Translate': promptMsg = `Translate the following content into Hindi / simple conversational language:\n\n${messageText}`; break;
      case 'Generate Code': promptMsg = `Convert the logic described below into complete production-ready code with comments:\n\n${messageText}`; break;
      case 'Debug': promptMsg = `Analyze this code/logic for bugs, performance bottlenecks, and security fixes:\n\n${messageText}`; break;
      case 'Continue': promptMsg = `Please continue writing from where you left off.`; break;
      default: promptMsg = `${actionType}:\n\n${messageText}`;
    }
    handleSend(promptMsg, actionType);
  };

  // Simple Markdown & Code block parser renderer
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Split code blocks ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', text: content.slice(lastIndex, match.index) });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'code',
        code: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', text: content.slice(lastIndex) });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <div key={idx} className="ai-code-block">
            <div className="ai-code-header">
              <span>⚡ {part.language.toUpperCase()}</span>
              <button className="ai-code-copy-btn" onClick={() => handleCopyText(part.code)}>
                📋 Copy Code
              </button>
            </div>
            <pre className="ai-code-content">
              <code>{part.code}</code>
            </pre>
          </div>
        );
      }

      // Simple Markdown text formatter (bold, headings, bullet lists)
      const lines = part.text.split('\n');
      return (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} style={{ height: '6px' }} />;

            // Headings
            if (line.startsWith('### ')) return <h4 key={lIdx} style={{ margin: '8px 0 4px', color: '#38bdf8', fontSize: '15px' }}>{line.replace('### ', '')}</h4>;
            if (line.startsWith('## ')) return <h3 key={lIdx} style={{ margin: '10px 0 4px', color: '#818cf8', fontSize: '16px' }}>{line.replace('## ', '')}</h3>;
            if (line.startsWith('# ')) return <h2 key={lIdx} style={{ margin: '12px 0 6px', color: '#c084fc', fontSize: '18px' }}>{line.replace('# ', '')}</h2>;

            // Bullet points
            if (line.trim().startsWith('• ') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              const cleaned = line.trim().replace(/^[-*•]\s+/, '');
              return (
                <div key={lIdx} style={{ display: 'flex', gap: '8px', paddingLeft: '6px' }}>
                  <span style={{ color: '#818cf8' }}>•</span>
                  <span>{formatBoldText(cleaned)}</span>
                </div>
              );
            }

            return <div key={lIdx}>{formatBoldText(line)}</div>;
          })}
        </div>
      );
    });
  };

  const formatBoldText = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return <strong key={i} style={{ color: '#ffffff', fontWeight: '700' }}>{chunk.slice(2, -2)}</strong>;
      }
      return chunk;
    });
  };

  const sortedChats = [...chats].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt);
  const filteredChats = sortedChats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`ai-workspace-container ${!isPageMode ? 'ai-workspace-overlay-wrapper' : ''} ${isFullscreen ? 'ai-workspace-fullscreen' : ''}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(99, 102, 241, 0.95)',
          color: '#fff',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          zIndex: 3000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          pointerEvents: 'none'
        }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* History Sidebar */}
      <div className={`ai-sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
        <div className="ai-sidebar-header">
          <button className="ai-new-chat-btn" onClick={handleCreateNewChat}>
            ➕ New Conversation
          </button>
        </div>

        <div className="ai-search-box">
          <input
            className="ai-search-input"
            placeholder="🔍 Search chat history..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ai-chat-list">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              className={`ai-chat-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => { setActiveChatId(chat.id); setIsSidebarOpen(false); playClickSound(); }}
            >
              {editingChatId === chat.id ? (
                <input
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', width: '130px' }}
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                  onBlur={() => handleSaveRename(chat.id)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveRename(chat.id)}
                  autoFocus
                />
              ) : (
                <span className="ai-chat-item-title">
                  {chat.pinned ? '📌 ' : '💬 '}
                  {chat.title}
                </span>
              )}

              <div className="ai-chat-item-actions">
                <button title="Pin Chat" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }} onClick={e => handleTogglePin(e, chat.id)}>
                  {chat.pinned ? '📍' : '📌'}
                </button>
                <button title="Rename Chat" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }} onClick={e => handleStartRename(e, chat)}>
                  ✏️
                </button>
                <button title="Delete Chat" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }} onClick={e => handleDeleteChat(e, chat.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main AI Workspace Area */}
      <div className="ai-main-area">
        {/* Header Bar */}
        <div className="ai-header">
          <div className="ai-title-wrap">
            <button className="ai-icon-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle History">
              📂
            </button>
            <div className="ai-logo-icon">🤖</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ai-header-title">Gemini AI Workspace</span>
                {currentMode && (
                  <span className="ai-header-badge">
                    {currentMode.icon} {currentMode.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="ai-header-controls">
            <button className="ai-icon-btn" onClick={() => handleExportChat()} title="Export Chat Markdown">
              📤
            </button>
            <button className="ai-icon-btn" onClick={() => setIsFullscreen(!isFullscreen)} title="Toggle Fullscreen">
              {isFullscreen ? '🗗' : '⛶'}
            </button>
            {onClose && (
              <button className="ai-icon-btn" onClick={onClose} title="Close Workspace">
                ✖
              </button>
            )}
          </div>
        </div>

        {/* Message Container */}
        <div className="ai-messages-container">
          {activeMessages.map(msg => (
            <div key={msg.id} className={`ai-message-row ${msg.sender}`}>
              <div className={`ai-avatar ${msg.sender}`}>
                {msg.sender === 'user' ? '👤' : '✨'}
              </div>

              <div style={{ flex: 1, maxWidth: '90%' }}>
                {msg.mode && msg.sender === 'gemini' && (
                  <div className="ai-mode-tag">
                    {msg.mode.icon} Mode: {msg.mode.name}
                  </div>
                )}

                <div className="ai-bubble">
                  {msg.file && (
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 10px', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                      📎 Attached: {msg.file.name}
                    </div>
                  )}

                  {renderFormattedContent(msg.text)}

                  {/* Contextual Quick Actions for Model Messages */}
                  {msg.sender === 'gemini' && msg.id !== 'msg_welcome' && (
                    <div className="ai-quick-actions">
                      {['Rewrite', 'Summarize', 'Explain', 'Expand', 'Shorten', 'Translate', 'Generate Code', 'Debug'].map(act => (
                        <button key={act} className="ai-quick-btn" onClick={() => handleQuickAction(act, msg.text)}>
                          ✨ {act}
                        </button>
                      ))}
                      <button className="ai-quick-btn" onClick={() => handleCopyText(msg.text)}>
                        📋 Copy
                      </button>
                      <button className="ai-quick-btn" onClick={() => handleSend(msg.text, 'Regenerate')}>
                        🔄 Regenerate
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Follow-up chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="ai-followup-chips">
                    {msg.suggestedFollowUps.map((chip, cIdx) => (
                      <button key={cIdx} className="ai-followup-chip" onClick={() => handleSend(chip)}>
                        👉 {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking animation indicator */}
          {loading && (
            <div className="ai-message-row model">
              <div className="ai-avatar model">✨</div>
              <div className="ai-thinking-box">
                <div className="ai-pulse-dot" />
                <div className="ai-pulse-dot" />
                <div className="ai-pulse-dot" />
                <span>Google Gemini thinking & generating solution...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="ai-input-area">
          {/* Quick Prompt Chips */}
          <div className="ai-quick-chips-bar">
            {[
              { label: '✍️ Improve Writing', prompt: 'Improve this content with professional tone and formatting:' },
              { label: '💻 Write Code', prompt: 'Write a production-ready clean code function for:' },
              { label: '📚 Study Roadmap', prompt: 'Create a 30-day step-by-step study learning roadmap for:' },
              { label: '📄 Summarize Doc', prompt: 'Summarize the attached document into key bullet points:' },
              { label: '💼 Resume Optimization', prompt: 'Optimize my resume experience bullet points for high ATS score:' },
              { label: '✉️ Draft Email', prompt: 'Draft a concise, high-converting professional outreach email for:' }
            ].map((chip, idx) => (
              <button key={idx} className="ai-prompt-chip" onClick={() => setPrompt(chip.prompt + ' ')}>
                {chip.label}
              </button>
            ))}
          </div>

          {/* Attachment Preview */}
          {attachedFile && (
            <div className="ai-attachment-preview">
              <span>📎 {attachedFile.name}</span>
              <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => setAttachedFile(null)}>
                ✖ Remove
              </button>
            </div>
          )}

          {/* Textarea Input Form */}
          <div className="ai-input-wrapper">
            <button className="ai-icon-btn" title="Upload Document / Image" onClick={() => fileInputRef.current?.click()}>
              📎
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.docx,.txt"
            />

            <button className="ai-icon-btn" title="Capture Screen" onClick={handleScreenshot}>
              📷
            </button>

            <textarea
              ref={textareaRef}
              className="ai-textarea"
              placeholder="Ask Gemini anything (Write, Code, Study, Debug, Plan, Analyze)..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />

            <button className="ai-send-btn" onClick={() => handleSend()} disabled={loading || (!prompt.trim() && !attachedFile)}>
              🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
