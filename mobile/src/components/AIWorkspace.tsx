import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface AIWorkspaceProps {
  onClose: () => void;
  currentPage?: string;
  selectedTrendingJob?: any;
}

const DEFAULT_WELCOME = {
  id: 'msg_welcome',
  sender: 'gemini',
  text: `👋 **Welcome to your Premium Gemini AI Workspace!**

I am your multi-purpose intelligence engine. I can help you **write, code, learn, research, analyze, and optimize your career**.

💡 **Quick Start Suggestions:**
• *What careers are best after studying Computer Science?*
• *Write a professional resume summary for a software developer.*
• *Generate 5 practice quiz questions on Ratio & Proportion.*`,
  suggestedFollowUps: [
    "💻 React state component example",
    "📝 Professional resume summary",
    "📚 Ratio & Proportion practice questions"
  ]
};

export default function AIWorkspace({ onClose, currentPage = 'home', selectedTrendingJob = null }: AIWorkspaceProps) {
  const [messages, setMessages] = useState<any[]>([DEFAULT_WELCOME]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async (forcedPrompt?: string) => {
    const userMessage = forcedPrompt || prompt.trim();
    if (!userMessage) return;

    setPrompt('');
    const userMsgObj = {
      id: 'msg_u_' + Date.now(),
      sender: 'user',
      text: userMessage
    };

    setMessages(prev => [...prev, userMsgObj]);
    setLoading(true);

    const historyPayload = messages
      .filter(m => m.id !== 'msg_welcome')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload,
          screenContext: {
            currentPage,
            selectedTrendingJob: selectedTrendingJob ? selectedTrendingJob.title : 'None'
          }
        })
      });

      const data = await response.json();
      if (data.success && data.response) {
        const aiMsgObj = {
          id: 'msg_ai_' + Date.now(),
          sender: 'gemini',
          text: data.response,
          suggestedFollowUps: data.suggestedFollowUps || []
        };
        setMessages(prev => [...prev, aiMsgObj]);
      } else {
        throw new Error(data.error || 'Invalid API response format');
      }
    } catch (err: any) {
      console.error("Chat API Error:", err);
      const errorMsgObj = {
        id: 'msg_err_' + Date.now(),
        sender: 'gemini',
        text: `⚠️ **Connection Status Update**\n\nI was unable to process your request via live Gemini models.\n\n📖 **Details:** ${err.message}\n\n💡 **Action:** Please check if the backend server is running and your \`GEMINI_API_KEY\` is active.`
      };
      setMessages(prev => [...prev, errorMsgObj]);
    }
    setLoading(false);
  };

  // Simple Markdown Renderer
  const renderText = (txt: string) => {
    const lines = txt.split('\n');
    return lines.map((line, idx) => {
      let isBold = false;
      let textContent = line;

      if (line.startsWith('•') || line.startsWith('*')) {
        textContent = '  •  ' + line.slice(1).trim();
      }

      // Simple check for bold markers **
      const boldParts = textContent.split('**');
      if (boldParts.length > 1) {
        return (
          <Text key={idx} style={styles.lineStyle}>
            {boldParts.map((part, pIdx) => (
              <Text key={pIdx} style={pIdx % 2 === 1 ? { fontWeight: '900', color: colors.primary } : null}>
                {part}
              </Text>
            ))}
          </Text>
        );
      }

      return (
        <Text key={idx} style={[styles.lineStyle, { color: colors.textMain }]}>
          {textContent}
        </Text>
      );
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>🤖 Premium AI Workspace</Text>
        <TouchableOpacity style={[styles.closeBtn, { borderColor: colors.borderColor }]} onPress={onClose}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>Close</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatList}
        contentContainerStyle={{ padding: Spacing.three }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(m => {
          const isUser = m.sender === 'user';
          return (
            <View
              key={m.id}
              style={[
                styles.msgBubble,
                isUser
                  ? [styles.userBubble, { backgroundColor: colors.primary }]
                  : [styles.aiBubble, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]
              ]}
            >
              {!isUser && <Text style={[styles.senderLabel, { color: colors.primary }]}>Gemini AI 🤖</Text>}
              <View>{renderText(m.text)}</View>

              {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                <View style={styles.followUpsRow}>
                  {m.suggestedFollowUps.map((f: string, fIdx: number) => (
                    <TouchableOpacity
                      key={fIdx}
                      style={[styles.followUpBtn, { borderColor: colors.borderColor }]}
                      onPress={() => handleSend(f)}
                    >
                      <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {loading && (
          <View style={[styles.msgBubble, styles.aiBubble, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputRow, { borderTopColor: colors.borderColor, backgroundColor: colors.cardBg }]}>
        <TextInput
          style={[styles.input, { color: colors.textMain, backgroundColor: colors.inputBg, borderColor: colors.borderColor }]}
          placeholder="Ask Gemini anything..."
          placeholderTextColor={colors.textMuted}
          value={prompt}
          onChangeText={setPrompt}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.primary }]}
          onPress={() => handleSend()}
          disabled={loading}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  closeBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  chatList: {
    flex: 1,
  },
  msgBubble: {
    borderRadius: 20,
    padding: Spacing.three,
    marginVertical: Spacing.one,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  senderLabel: {
    fontSize: 10,
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  lineStyle: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 1,
  },
  followUpsRow: {
    marginTop: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  followUpBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  inputRow: {
    flexDirection: 'row',
    padding: Spacing.two,
    borderTopWidth: 1,
    gap: Spacing.two,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    fontSize: 13,
  },
  sendBtn: {
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
