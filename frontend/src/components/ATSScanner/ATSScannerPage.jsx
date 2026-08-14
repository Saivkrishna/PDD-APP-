import React, { useState, useRef } from 'react';

export default function ATSScannerPage({ onBack, t, user, soundEnabled }) {
  // Steps: 1: Upload Resume, 2: Paste Job Description, 3: Dashboard Results
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedResume, setExtractedResume] = useState(null);
  const [jdText, setJdText] = useState('');
  const [parsedJd, setParsedJd] = useState(null);

  // Tabs for the Resume Sections view in step 3
  const [activeResumeTab, setActiveResumeTab] = useState('ALL');
  const [activeJdTab, setActiveJdTab] = useState('skills');

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
      setExtractedResume(null);
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
      setExtractedResume(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedResume(null);
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

        setExtractedResume(data);
        setStep(2); // Go to next step
      } catch (err) {
        setError(err.message || 'An error occurred during resume extraction.');
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

  const handleParseJd = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ats/parse-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jdText
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse job description.');
      }

      setParsedJd(data.parsedJd);
      setStep(3); // Go to results
    } catch (err) {
      setError(err.message || 'An error occurred during Job Description parsing.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedResume(null);
    setJdText('');
    setParsedJd(null);
    setError('');
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resumeTabs = [
    { id: 'ALL', label: 'All Text' },
    { id: 'SUMMARY', label: 'Summary' },
    { id: 'SKILLS', label: 'Skills' },
    { id: 'EXPERIENCE', label: 'Experience' },
    { id: 'PROJECTS', label: 'Projects' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'CERTIFICATIONS', label: 'Certifications' }
  ];

  const getResumeTabContent = () => {
    if (!extractedResume) return '';
    if (activeResumeTab === 'ALL') return extractedResume.text || '';
    return extractedResume.sections[activeResumeTab] || `No content detected under ${activeResumeTab}.`;
  };

  return (
    <div style={styles.container}>
      {/* CSS overrides for styling */}
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
          max-height: 400px;
          min-height: 250px;
        }
        .skill-badge {
          display: inline-block;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 15px;
          margin-right: 8px;
          margin-bottom: 8px;
          text-transform: capitalize;
        }
        .skill-badge.required {
          background: rgba(4, 170, 109, 0.12);
          color: var(--primary);
          border: 1px solid var(--primary);
        }
        .skill-badge.preferred {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border: 1px solid #38bdf8;
        }
        .skill-badge.optional {
          background: rgba(156, 163, 175, 0.12);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .jd-textarea {
          width: 100%;
          min-height: 250px;
          padding: 16px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.5;
          outline: none;
          resize: vertical;
        }
        .jd-textarea:focus {
          border-color: var(--primary);
        }
      `}</style>

      {/* Header Bar */}
      <div style={styles.header}>
        <button
          className="premium-btn"
          style={styles.backBtn}
          onClick={step === 1 ? onBack : () => setStep(prev => prev - 1)}
        >
          ← {step === 1 ? 'Back' : 'Previous Step'}
        </button>
        <h2 style={styles.headerTitle}>ATS Resume Scanner 🔎</h2>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
          Step {step} of 3
        </div>
      </div>

      {/* Step Indicators */}
      <div style={styles.progressRow}>
        <div style={{ ...styles.progressItem, color: step >= 1 ? 'var(--primary)' : 'var(--text-muted)' }}>
          1. Upload Resume {step > 1 && '✓'}
        </div>
        <div style={styles.progressDivider} />
        <div style={{ ...styles.progressItem, color: step >= 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
          2. Paste Job Description {step > 2 && '✓'}
        </div>
        <div style={styles.progressDivider} />
        <div style={{ ...styles.progressItem, color: step >= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>
          3. ATS Analysis Dashboard
        </div>
      </div>

      {/* STEP 1: UPLOAD RESUME */}
      {step === 1 && (
        <div style={styles.grid}>
          {/* Upload Card */}
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
              {loading ? 'Processing Resume...' : 'Parse & Continue →'}
            </button>
          </div>

          {/* Intro/Instructions Card */}
          <div className="bento-card span-7 premium-glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>How Phase 1 Extraction Works</h3>
            <p style={styles.cardDesc}>
              Our local parser splits your file and extracts text using in-memory converters.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <div style={styles.stepTip}>
                <span style={styles.tipIcon}>🔒</span>
                <div>
                  <div style={styles.tipTitle}>100% Client/Local Privacy</div>
                  <div style={styles.tipText}>We never upload files to external LLM services or paid APIs. Everything stays local.</div>
                </div>
              </div>
              <div style={styles.stepTip}>
                <span style={styles.tipIcon}>📁</span>
                <div>
                  <div style={styles.tipTitle}>Multiple Extensions Supported</div>
                  <div style={styles.tipText}>Easily extract layout blocks from standard PDF files or DOCX structures.</div>
                </div>
              </div>
              <div style={styles.stepTip}>
                <span style={styles.tipIcon}>🗂️</span>
                <div>
                  <div style={styles.tipTitle}>Rule-Based Chunking</div>
                  <div style={styles.tipText}>Our tokenizer scans for headings dynamically to segment resume skills, experience, and educational logs.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PASTE JOB DESCRIPTION */}
      {step === 2 && (
        <div style={styles.grid}>
          {/* JD Pasting Panel */}
          <div className="bento-card span-7 premium-glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>Paste Job Description</h3>
            <p style={styles.cardDesc}>
              Paste the target job description details below. The parser will extract key requirements.
            </p>

            <textarea
              className="jd-textarea"
              placeholder="Paste job description here... (Include Job Title, Responsibilities, and requirements like 'React required, AWS is a plus' or '3+ years experience')"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                className="premium-btn"
                disabled={loading || !jdText.trim()}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  opacity: loading || !jdText.trim() ? 0.6 : 1,
                  cursor: loading || !jdText.trim() ? 'not-allowed' : 'pointer'
                }}
                onClick={handleParseJd}
              >
                {loading ? 'Parsing Job Description...' : 'Parse Job Description 🚀'}
              </button>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="bento-card span-5 premium-glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>Heuristics & Extraction</h3>
            <p style={styles.cardDesc}>
              Learn how we categorize requirements without paid third-party APIs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={styles.infoRow}>
                <strong style={{ color: 'var(--primary)' }}>Required vs Preferred:</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                  Scans for phrases like "must have", "minimum", "highly regarded", or "is a plus" to separate skills.
                </span>
              </div>
              <div style={styles.infoRow}>
                <strong style={{ color: 'var(--primary)' }}>Experience Range:</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                  Pulls years criteria like "3+ years" using regex match boundary models.
                </span>
              </div>
              <div style={styles.infoRow}>
                <strong style={{ color: 'var(--primary)' }}>Certifications & Credentials:</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                  Detects educational degree milestones (BS/MS) and industry certs (AWS, CSM).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: DASHBOARD RESULTS */}
      {step === 3 && parsedJd && (
        <div style={styles.grid}>
          {/* Left Side: Parsed Job Description Results */}
          <div className="bento-card span-6 premium-glass-card" style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={styles.cardTitle}>Parsed Job Description</h3>
              <button
                className="section-tab-btn"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={handleReset}
              >
                Scan New Resume
              </button>
            </div>

            {/* Quick Details Block */}
            <div style={styles.detailsBlock}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Job Title</div>
                <div style={styles.detailVal}>{parsedJd.jobTitle}</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Min Experience</div>
                <div style={styles.detailVal}>{parsedJd.experienceYears} Years</div>
              </div>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Education</div>
                <div style={styles.detailVal}>{parsedJd.education.join(', ')}</div>
              </div>
            </div>

            {/* Result Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto' }}>
              <button
                className={`section-tab-btn ${activeJdTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveJdTab('skills')}
              >
                Required/Preferred Skills
              </button>
              <button
                className={`section-tab-btn ${activeJdTab === 'responsibilities' ? 'active' : ''}`}
                onClick={() => setActiveJdTab('responsibilities')}
              >
                Responsibilities
              </button>
              <button
                className={`section-tab-btn ${activeJdTab === 'keywords' ? 'active' : ''}`}
                onClick={() => setActiveJdTab('keywords')}
              >
                Main Keywords
              </button>
            </div>

            {/* JD Results Tab Contents */}
            <div style={styles.jdTabContainer}>
              {activeJdTab === 'skills' && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={styles.subHeading}>Required Skills ({parsedJd.requiredSkills.length})</div>
                    {parsedJd.requiredSkills.length > 0 ? (
                      <div>
                        {parsedJd.requiredSkills.map(skill => (
                          <span key={skill} className="skill-badge required">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None explicitly detected.</span>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={styles.subHeading}>Preferred Skills ({parsedJd.preferredSkills.length})</div>
                    {parsedJd.preferredSkills.length > 0 ? (
                      <div>
                        {parsedJd.preferredSkills.map(skill => (
                          <span key={skill} className="skill-badge preferred">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None explicitly detected.</span>
                    )}
                  </div>

                  <div>
                    <div style={styles.subHeading}>Optional / Soft Skills ({parsedJd.optionalSkills.length})</div>
                    {parsedJd.optionalSkills.length > 0 ? (
                      <div>
                        {parsedJd.optionalSkills.map(skill => (
                          <span key={skill} className="skill-badge optional">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>None explicitly detected.</span>
                    )}
                  </div>
                </div>
              )}

              {activeJdTab === 'responsibilities' && (
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {parsedJd.responsibilities.map((resp, idx) => (
                    <li key={idx} style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                      {resp}
                    </li>
                  ))}
                </ul>
              )}

              {activeJdTab === 'keywords' && (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {parsedJd.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--bg-container)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-main)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Parsed Resume Section Reference */}
          <div className="bento-card span-6 premium-glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>Extracted Resume Sections</h3>
            <p style={styles.cardDesc}>
              Refer back to your extracted resume details side-by-side.
            </p>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '4px' }}>
              {resumeTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`section-tab-btn ${activeResumeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveResumeTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <pre className="section-preview" style={{ maxHeight: '350px' }}>
              {getResumeTabContent()}
            </pre>
          </div>
        </div>
      )}
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
    margin: '0 auto 15px auto',
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
  progressRow: {
    maxWidth: '800px',
    margin: '0 auto 30px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px'
  },
  progressItem: {
    fontSize: '13px',
    fontWeight: 'bold'
  },
  progressDivider: {
    flex: 1,
    height: '2px',
    background: 'var(--border-color)',
    margin: '0 15px'
  },
  grid: {
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
  stepTip: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  tipIcon: {
    fontSize: '20px'
  },
  tipTitle: {
    fontWeight: 'bold',
    color: 'var(--text-main)',
    fontSize: '13px'
  },
  tipText: {
    fontSize: '12px',
    color: 'var(--text-sub)',
    marginTop: '2px',
    lineHeight: 1.4
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px'
  },
  detailsBlock: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '20px'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  detailLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  detailVal: {
    fontSize: '13px',
    color: 'var(--text-main)',
    fontWeight: 'bold'
  },
  subHeading: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '8px'
  },
  jdTabContainer: {
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '200px',
    overflowY: 'auto'
  }
};
