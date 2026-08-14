import React, { useState, useRef } from 'react';

export default function ATSScannerPage({ onBack, t, user, soundEnabled }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // File Validation
  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const validateFile = (selectedFile) => {
    setError('');
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    const isAllowedMime = allowedMimeTypes.includes(selectedFile.type);
    const isAllowedExt = allowedExtensions.includes(ext);

    if (!isAllowedMime && !isAllowedExt) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && validateFile(selected)) {
      setFile(selected);
      setExtractedData(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && validateFile(dropped)) {
      setFile(dropped);
      setExtractedData(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedData(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleParseResume = () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const response = await fetch('/api/ats/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileData: base64Data,
            fileName: file.name,
            mimeType: file.type
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to extract resume text.');
        }

        setExtractedData(data);
        setActiveTab('ALL');
      } catch (err) {
        setError(err.message || 'An error occurred during extraction.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file.');
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // Section styling and helper tabs
  const tabs = [
    { id: 'ALL', label: 'All Text' },
    { id: 'SUMMARY', label: 'Summary' },
    { id: 'SKILLS', label: 'Skills' },
    { id: 'EXPERIENCE', label: 'Experience' },
    { id: 'PROJECTS', label: 'Projects' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'CERTIFICATIONS', label: 'Certifications' },
    { id: 'ACHIEVEMENTS', label: 'Achievements' }
  ];

  const getSectionContent = () => {
    if (!extractedData) return '';
    if (activeTab === 'ALL') return extractedData.text || 'No text found.';
    return extractedData.sections[activeTab] || `No content detected under section: ${activeTab}`;
  };

  return (
    <div style={styles.container}>
      {/* Dynamic inline styles to support both themes */}
      <style>{`
        .ats-dropzone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-card, 28px);
          padding: 40px 20px;
          text-align: center;
          background: rgba(255, 255, 255, 0.01);
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .ats-dropzone:hover {
          border-color: var(--primary);
          background: rgba(4, 170, 109, 0.02);
        }
        .section-tab-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: bold;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: var(--bg-container);
          color: var(--text-sub);
          cursor: pointer;
          transition: all 0.2s;
        }
        .section-tab-btn.active {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
        .section-preview {
          background: var(--input-bg, rgba(255,255,255,0.01));
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-main);
          white-space: pre-wrap;
          overflow-y: auto;
          max-height: 500px;
          min-height: 300px;
        }
      `}</style>

      {/* Header Bar */}
      <div style={styles.header}>
        <button className="premium-btn" style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2 style={styles.headerTitle}>ATS Resume Scanner 🔎</h2>
        <div style={{ width: '80px' }} /> {/* Spacer to center title */}
      </div>

      <div style={styles.content}>
        {/* Left Side: Upload & Control Bento Card */}
        <div className="bento-card span-5 premium-glass-card" style={styles.card}>
          <div>
            <h3 style={styles.cardTitle}>Upload Resume</h3>
            <p style={styles.cardDesc}>
              Select or drop your PDF, DOCX, or Plain Text resume file to run local section analysis.
            </p>

            {!file ? (
              <div
                className="ats-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                  Drag & drop resume here
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  or click to browse from computer (Max 5MB)
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div style={styles.fileBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{ fontSize: '28px' }}>
                    {file.name.endsWith('.pdf') ? '📕' : file.name.endsWith('.docx') ? '📘' : '📝'}
                  </span>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  style={styles.removeBtn}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            )}

            {error && <div style={styles.errorAlert}>⚠️ {error}</div>}
          </div>

          <button
            className="premium-btn"
            disabled={!file || loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              marginTop: '20px',
              opacity: !file || loading ? 0.6 : 1,
              cursor: !file || loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleParseResume}
          >
            {loading ? 'Processing Resume...' : 'Parse & Extract Sections 🚀'}
          </button>
        </div>

        {/* Right Side: Extraction Results Bento Card */}
        <div className="bento-card span-7 premium-glass-card" style={styles.card}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' }}>
            <div>
              <h3 style={styles.cardTitle}>Section Analysis Preview</h3>
              <p style={styles.cardDesc}>
                Browse the text mapped to standard resume sections detected by the rule-based engine.
              </p>
            </div>

            {extractedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                {/* Tabs Grid */}
                <div style={styles.tabsGrid}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`section-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Text View Panel */}
                <pre className="section-preview">
                  {getSectionContent()}
                </pre>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔍</div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>No parsed resume found</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Your extracted sections and raw text preview will appear here after parsing.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    padding: '20px',
    fontFamily: 'Inter, sans-serif'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 20px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '15px'
  },
  backBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 'bold',
    background: 'var(--btn-bg, #fff)',
    color: 'var(--btn-text, #000)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    cursor: 'pointer'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 900,
    fontFamily: 'Outfit, sans-serif'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '24px'
  },
  card: {
    padding: '24px',
    height: 'fit-content',
    minHeight: '450px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 900,
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-main)'
  },
  cardDesc: {
    fontSize: '12px',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
    marginTop: '4px',
    marginBottom: '20px'
  },
  fileBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#fc8181',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '15px'
  },
  tabsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
    border: '1px dashed var(--border-color)',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.01)'
  }
};
