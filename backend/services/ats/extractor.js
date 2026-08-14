/**
 * backend/services/ats/extractor.js
 * Extracts raw text from PDF, DOCX, and TXT file buffers using pdf-parse and mammoth.
 */

const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw text from a file buffer.
 * @param {Buffer} buffer - The binary file contents.
 * @param {string} mimeType - The file's MIME type.
 * @param {string} fileName - The original filename.
 * @returns {Promise<string>} The clean extracted text.
 */
async function extractText(buffer, mimeType, fileName = '') {
  const nameLower = fileName.toLowerCase();
  const mimeLower = (mimeType || '').toLowerCase();

  // 1. PDF Handler
  if (mimeLower === 'application/pdf' || nameLower.endsWith('.pdf')) {
    try {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      return data.text || '';
    } catch (err) {
      throw new Error(`Failed to parse PDF file: ${err.message}`);
    }
  }

  // 2. Word Document Handler (DOCX)
  if (
    mimeLower === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    nameLower.endsWith('.docx')
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (err) {
      throw new Error(`Failed to parse Word (.docx) file: ${err.message}`);
    }
  }

  // 3. Plain Text Handler (TXT)
  if (mimeLower === 'text/plain' || nameLower.endsWith('.txt')) {
    try {
      return buffer.toString('utf8');
    } catch (err) {
      throw new Error(`Failed to read Text file: ${err.message}`);
    }
  }

  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
}

module.exports = {
  extractText
};
