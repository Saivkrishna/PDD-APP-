import React, { useState, useRef } from 'react';

const API = process.env.REACT_APP_API_URL || '/api';

export default function ATSScannerPage({ onBack, t, user, soundEnabled }) {
  // Steps: 1: Upload Resume, 2: Paste Job Description, 3: Dashboard Results
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedResume, setExtractedResume] = useState(null);
  const [jdText, setJdText] = useState('');
  const [parsedJd, setParsedJd] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [matchLabel, setMatchLabel] = useState('');
  const [subScores, setSubScores] = useState(null);
  const [formattingChecks, setFormattingChecks] = useState([]);

  // Tabs for the panels in step 3
  const [activeResumeTab, setActiveResumeTab] = useState('ALL');
  const [activeJdTab, setActiveJdTab] = useState('match-analysis');

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
        const response = await fetch(`${API}/ats/extract`, {
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
      // 1. Parse Job Description requirements
      const response = await fetch(`${API}/ats/parse-jd`, {
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

      // 2. Perform Skill & Keyword Matching
      const matchResponse = await fetch(`${API}/ats/match-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeSections: extractedResume.sections,
          parsedJd: data.parsedJd
        })
      });

      const matchData = await matchResponse.json();
      if (!matchResponse.ok) {
        throw new Error(matchData.error || 'Failed to match resume skills.');
      }

      setMatchedSkills(matchData.matchedSkills);
      setMissingSkills(matchData.missingSkills);

      // 3. Compute Rule-Based ATS score
      const scoreResponse = await fetch(`${API}/ats/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeSections: extractedResume.sections,
          parsedJd: data.parsedJd,
          matchedSkills: matchData.matchedSkills,
          missingSkills: matchData.missingSkills
        })
      });

      const scoreData = await scoreResponse.json();
      if (!scoreResponse.ok) {
        throw new Error(scoreData.error || 'Failed to compute scoring breakdown.');
      }

      setOverallScore(scoreData.overallScore);
      setMatchLabel(scoreData.matchLabel);
      setSubScores(scoreData.subScores);
      setFormattingChecks(scoreData.formattingChecks || []);
      setStep(3); // Go to results dashboard
    } catch (err) {
      setError(err.message || 'An error occurred during parsing or score calculation.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedResume(null);
    setJdText('');
    setParsedJd(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setOverallScore(0);
    setMatchLabel('');
    setSubScores(null);
    setFormattingChecks([]);
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
    { id: 'EDUCATION', label: 'Education' }
  ];

  const getResumeTabContent = () => {
    if (!extractedResume) return '';
    if (activeResumeTab === 'ALL') return extractedResume.text || '';
    return extractedResume.sections[activeResumeTab] || `No content detected under ${activeResumeTab}.`;
  };

  // Helper to format match type labels nicely
  const getMatchTypeLabel = (type, details) => {
    switch (type) {
      case 'exact': return 'Exact Match';
      case 'synonym': return `Synonym Match (Matched '${details}')`;
      case 'fuzzy': return `Fuzzy Match (Matched '${details}')`;
      case 'related-not-matched': return `${details}`;
      default: return 'Matched';
    }
  };

  // Helper to get score color variables
  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'var(--primary)', bg: 'rgba(4, 170, 109, 0.1)' };
    if (score >= 65) return { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' };
    if (score >= 50) return { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    return { text: '#ff8b8b', bg: 'rgba(255, 139, 139, 0.1)' };
  };

  const renderProgressBar = (label, value) => {
    const intVal = Math.round(value || 0);
    const hasSemanticTooltip = label.startsWith('Experience Relevance') || label.startsWith('Project Relevance');
    return (
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>
          <span style={{ color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {label}
            {hasSemanticTooltip && (
              <span className="skill-badge-container">
                <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'help' }}>🧠</span>
                <span className="skill-badge-tooltip" style={{ width: '220px', marginLeft: '-110px' }}>
                  Augmented with local AI semantic similarity meaning match (Xenova Model).
                </span>
              </span>
            )}
          </span>
          <span style={{ color: 'var(--text-main)' }}>{intVal}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--primary)', width: `${intVal}%`, borderRadius: '4px', transition: 'width 0.4s ease' }} />
        </div>
      </div>
    );
  };

  const scoreColors = getScoreColor(overallScore);

  return (
    <div style={styles.container}>
      {/* Styles & Hover Tooltips */}
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
        .skill-badge-container {
          position: relative;
          display: inline-block;
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
          cursor: help;
        }
        .skill-badge.matched-yes {
          background: rgba(4, 170, 109, 0.12);
          color: var(--primary);
          border: 1px solid var(--primary);
        }
        .skill-badge.matched-related {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }
        .skill-badge.matched-no {
          background: rgba(156, 163, 175, 0.12);
          color: var(--text-sub);
          border: 1px solid var(--border-color);
        }
        .skill-badge-tooltip {
          visibility: hidden;
          width: 180px;
          background-color: #222;
          border: 1px solid var(--border-color);
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 6px 8px;
          position: absolute;
          z-index: 10;
          bottom: 125%;
          left: 50%;
          margin-left: -90px;
          opacity: 0;
          transition: opacity 0.2s;
          font-size: 11px;
          line-height: 1.3;
          pointer-events: none;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .skill-badge-container:hover .skill-badge-tooltip {
          visibility: visible;
          opacity: 1;
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
          3. ATS Scoring Dashboard
        </div>
      </div>

      {/* STEP 1: UPLOAD RESUME */}
      {step === 1 && (
        <div className="bento-grid">
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
            <h3 style={styles.cardTitle}>How Local Extraction Works</h3>
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
        <div className="bento-grid">
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
                {loading ? 'Analyzing & Scoring...' : 'Run Scoring & Match Analysis 🚀'}
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
      {step === 3 && parsedJd && subScores && (
        <div className="bento-grid">
          {/* Left Side: Scoring Dashboard (Overall + Sub-scores) */}
          <div className="bento-card span-6 premium-glass-card" style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={styles.cardTitle}>ATS Score Dashboard</h3>
              <button
                className="section-tab-btn"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={handleReset}
              >
                Reset & Scan New
              </button>
            </div>

            {/* Score Display Ring Block */}
            <div style={styles.scoreContainer}>
              <div style={{ ...styles.scoreCircle, borderColor: scoreColors.text, backgroundColor: scoreColors.bg }}>
                <span style={styles.scoreNum}>{overallScore}</span>
                <span style={styles.scoreMax}>/100</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={styles.scoreLabel}>CareerPath AI Compatibility Score</div>
                <div style={{ ...styles.matchLabel, color: scoreColors.text }}>{matchLabel}</div>
              </div>
            </div>

            {/* Progress Bars for Breakdown */}
            <div style={styles.subScoresContainer}>
              <h4 style={{ ...styles.subHeading, marginBottom: '14px' }}>Sub-Score Breakdown</h4>
              {renderProgressBar('Keyword Match (25%)', subScores.keywordMatch)}
              {renderProgressBar('Technical Skills (20%)', subScores.technicalSkills)}
              {renderProgressBar('Experience Relevance (15%)', subScores.experienceRelevance)}
              {renderProgressBar('Project Relevance (10%)', subScores.projectRelevance)}
              {renderProgressBar('Resume Structure (10%)', subScores.resumeStructure)}
              {renderProgressBar('Education Fit (5%)', subScores.education)}
              {renderProgressBar('Certifications (5%)', subScores.certifications)}
              {renderProgressBar('Achievements & Metrics (5%)', subScores.achievements)}
              {renderProgressBar('ATS Layout Formatting (5%)', subScores.atsFormatting)}
            </div>
          </div>

          {/* Right Side: Tabbed Skills Analysis & Details */}
          <div className="bento-card span-6 premium-glass-card" style={styles.card}>
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                className={`section-tab-btn ${activeJdTab === 'match-analysis' ? 'active' : ''}`}
                onClick={() => setActiveJdTab('match-analysis')}
              >
                Skills Match
              </button>
              <button
                className={`section-tab-btn ${activeJdTab === 'formatting-check' ? 'active' : ''}`}
                onClick={() => setActiveJdTab('formatting-check')}
              >
                Formatting & Structure
              </button>
              <button
                className={`section-tab-btn ${activeJdTab === 'resume-ref' ? 'active' : ''}`}
                onClick={() => setActiveJdTab('resume-ref')}
              >
                Resume text
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
                Keywords
              </button>
            </div>

            {/* Tab Contents */}
            <div style={styles.jdTabContainer}>
              {/* Matched vs Missing Skills Analysis */}
              {activeJdTab === 'match-analysis' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={styles.subHeading}>Matched Skills ({matchedSkills.filter(s => s.matchType !== 'related-not-matched').length})</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Hover/tap a chip to inspect the local match criteria.
                    </p>
                    {matchedSkills.filter(s => s.matchType !== 'related-not-matched').length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {matchedSkills.filter(s => s.matchType !== 'related-not-matched').map(item => (
                          <div key={item.skill} className="skill-badge-container">
                            <span className="skill-badge matched-yes">
                              {item.skill}
                            </span>
                            <span className="skill-badge-tooltip">
                              {getMatchTypeLabel(item.matchType, item.matchedText)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No matches found.</span>
                    )}
                  </div>

                  {/* Related/Partial Matches */}
                  {matchedSkills.filter(s => s.matchType === 'related-not-matched').length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ ...styles.subHeading, color: '#f59e0b' }}>Related Skills In Resume ({matchedSkills.filter(s => s.matchType === 'related-not-matched').length})</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        These related skills are present in your resume but do not count as direct matches.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {matchedSkills.filter(s => s.matchType === 'related-not-matched').map(item => (
                          <div key={item.skill} className="skill-badge-container">
                            <span className="skill-badge matched-related">
                              {item.skill}
                            </span>
                            <span className="skill-badge-tooltip">
                              {item.matchedText}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={styles.subHeading}>Missing Skills ({missingSkills.length})</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      These required or preferred skills from the JD are missing in your resume.
                    </p>
                    {missingSkills.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {missingSkills.map(item => (
                          <span key={item.skill} className="skill-badge matched-no">
                            {item.skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 'bold' }}>🎉 Perfect Match! No missing skills.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Formatting & Structure Checklist */}
              {activeJdTab === 'formatting-check' && (
                <div>
                  <div style={styles.subHeading}>ATS Formatting Checklist</div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Heuristic evaluation showing potential layout/format compatibility flags.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formattingChecks.map((chk, idx) => {
                      let statusColor = '#04AA6D'; // green for pass
                      let statusIcon = '✓';
                      let statusBg = 'rgba(4, 170, 109, 0.1)';
                      if (chk.status === 'warning') {
                        statusColor = '#f59e0b'; // orange for warning
                        statusIcon = '⚠️';
                        statusBg = 'rgba(245, 158, 11, 0.1)';
                      } else if (chk.status === 'fail') {
                        statusColor = '#ff8b8b'; // red for fail
                        statusIcon = '✗';
                        statusBg = 'rgba(255, 139, 139, 0.1)';
                      }
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            background: 'var(--bg-container)'
                          }}
                        >
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              color: statusColor,
                              backgroundColor: statusBg,
                              flexShrink: 0
                            }}
                          >
                            {statusIcon}
                          </span>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-main)' }}>
                              {chk.checkName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '2px', lineHeight: 1.4 }}>
                              {chk.message}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Resume text tab */}
              {activeJdTab === 'resume-ref' && (
                <div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {resumeTabs.map(tab => (
                      <button
                        key={tab.id}
                        className={`section-tab-btn ${activeResumeTab === tab.id ? 'active' : ''}`}
                        style={{ fontSize: '11px', padding: '6px 12px' }}
                        onClick={() => setActiveResumeTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <pre className="section-preview" style={{ maxHeight: '250px', minHeight: '200px' }}>
                    {getResumeTabContent()}
                  </pre>
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
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px'
  },
  scoreCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1px'
  },
  scoreNum: {
    fontSize: '32px',
    fontWeight: '900',
    fontFamily: 'Outfit, sans-serif'
  },
  scoreMax: {
    fontSize: '12px',
    fontWeight: 'bold',
    opacity: 0.6,
    alignSelf: 'flex-end',
    marginBottom: '18px'
  },
  scoreLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  matchLabel: {
    fontSize: '22px',
    fontWeight: '900',
    fontFamily: 'Outfit, sans-serif',
    marginTop: '4px'
  },
  subScoresContainer: {
    background: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '20px'
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
    minHeight: '280px',
    maxHeight: '400px',
    overflowY: 'auto'
  }
};
