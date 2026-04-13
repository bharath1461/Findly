/* =============================================
   FINDLY v2.0 – script.js
   AI-powered document search & summarization
   ============================================= */

// Use pdf.js from CDN (loaded as ES module)
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

'use strict';

// --------- DOM REFERENCES ---------
const dropZone      = document.getElementById('drop-zone');
const fileInput     = document.getElementById('file-input');
const fileList      = document.getElementById('file-list');
const fileName      = document.getElementById('file-name');
const fileSize      = document.getElementById('file-size');
const removeFileBtn = document.getElementById('remove-file');

const progressWrap  = document.getElementById('progress-wrap');
const progressFill  = document.getElementById('progress-fill');
const progressText  = document.getElementById('progress-text');

const docStats      = document.getElementById('doc-stats');
const statPages     = document.getElementById('stat-pages');
const statWords     = document.getElementById('stat-words');
const statChars     = document.getElementById('stat-chars');

const searchInput   = document.getElementById('search-input');
const searchBtn     = document.getElementById('search-btn');
const resultsArea   = document.getElementById('results-area');
const resultsList   = document.getElementById('results-list');
const resultsCount  = document.getElementById('results-count');

const apiKeyInput   = document.getElementById('api-key-input');
const toggleKey     = document.getElementById('toggle-key');
const summarizeBtn  = document.getElementById('summarize-btn');
const spinner       = document.getElementById('spinner');
const summaryOutput = document.getElementById('summary-output');
const summaryText   = document.getElementById('summary-text');
const copyBtn       = document.getElementById('copy-btn');
const errorBox      = document.getElementById('error-box');
const errorMsg      = document.getElementById('error-msg');

const themeToggle   = document.getElementById('theme-toggle');
const themeIcon     = document.getElementById('theme-icon');
const toastContainer = document.getElementById('toast-container');

// --------- STATE ---------
let documentText = '';
let uploadedFileName = '';
let docChunks = [];
let pageCount = 0;
let hasRealDocument = false;

// Demo paragraph bank
const DEMO_PARAGRAPHS = [
  'Artificial intelligence (AI) is rapidly transforming industries worldwide. From healthcare diagnostics to financial risk modeling, machine learning models are now capable of performing tasks that were once exclusive to human experts.',
  'Natural language processing (NLP) enables computers to understand and generate human language. Modern large language models (LLMs) such as GPT-4 can summarize documents, answer questions, and even write code with remarkable accuracy.',
  'Document management systems increasingly rely on AI-powered search to retrieve relevant information quickly. Traditional keyword search is giving way to semantic search, which understands the meaning behind queries.',
  'Data privacy and security are critical considerations when deploying AI applications. Organizations must comply with regulations such as GDPR and HIPAA to protect user data and maintain trust.',
  'The rise of generative AI has created new opportunities for content creation, allowing businesses to produce marketing materials, reports, and educational content at scale with minimal human effort.',
  'Cloud computing provides the scalable infrastructure needed to train and deploy large AI models. Providers such as AWS, Google Cloud, and Azure offer managed AI services that simplify integration.',
  'Machine learning pipelines typically consist of data ingestion, preprocessing, feature engineering, model training, evaluation, and deployment stages. Each stage requires careful design to ensure model quality.',
  'Retrieval-augmented generation (RAG) combines the strengths of information retrieval systems with generative models, allowing AI to answer questions grounded in specific document corpora.',
  'The future of work is being reshaped by automation and AI. While certain repetitive jobs are being replaced, new roles are emerging around AI model supervision, ethics, and human-AI collaboration.',
  'Performance benchmarks for AI models include accuracy, precision, recall, F1 score, and latency. Businesses must balance model performance against computational cost when choosing deployment strategies.',
];

// --------- UTILITIES ---------
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatNumber(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightQuery(text, query) {
  if (!query.trim()) return escapeHtml(text);
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

function show(el)  { if (el) el.hidden = false; }
function hide(el)  { if (el) el.hidden = true;  }

// --------- TOAST NOTIFICATIONS ---------
function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '⚠️', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// --------- ERROR HANDLING ---------
function showError(msg) {
  errorMsg.textContent = msg;
  show(errorBox);
}

function clearError() { hide(errorBox); }

// --------- THEME TOGGLE ---------
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('findly_theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Restore saved theme
const savedTheme = localStorage.getItem('findly_theme') || 'dark';
setTheme(savedTheme);

// --------- PDF TEXT EXTRACTION (pdf.js) ---------
async function extractPdfText(file) {
  show(progressWrap);
  progressFill.style.width = '0%';
  progressText.textContent = 'Loading PDF…';

  try {
    const arrayBuffer = await file.arrayBuffer();
    progressFill.style.width = '20%';
    progressText.textContent = 'Parsing document…';

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    pageCount = pdf.numPages;

    let fullText = '';
    const chunks = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';

      // Split into meaningful chunks (~300 chars each)
      if (pageText.trim().length > 0) {
        const sentences = pageText.split(/(?<=[.!?])\s+/);
        let currentChunk = '';
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > 300 && currentChunk.length > 40) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
          }
        }
        if (currentChunk.trim().length > 20) {
          chunks.push(currentChunk.trim());
        }
      }

      const progress = 20 + (i / pdf.numPages) * 70;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `Extracting page ${i} of ${pdf.numPages}…`;
    }

    progressFill.style.width = '100%';
    progressText.textContent = 'Done!';

    setTimeout(() => hide(progressWrap), 800);

    if (fullText.trim().length > 50 && chunks.length > 0) {
      documentText = fullText.trim();
      docChunks = chunks;
      hasRealDocument = true;
      updateDocStats();
      return true;
    } else {
      // PDF had no extractable text (e.g., scanned image)
      showToast('PDF has no extractable text. Using demo content for preview.', 'info');
      useDemoContent();
      return false;
    }
  } catch (err) {
    console.error('PDF extraction error:', err);
    showToast('Could not parse PDF. Using demo content. Error: ' + err.message, 'error');
    hide(progressWrap);
    useDemoContent();
    return false;
  }
}

function updateDocStats() {
  const words = documentText.split(/\s+/).filter(Boolean).length;
  const chars = documentText.length;

  statPages.textContent = pageCount || '—';
  statWords.textContent = formatNumber(words);
  statChars.textContent = formatNumber(chars);
  show(docStats);
}

// --------- FILE UPLOAD ---------
async function handleFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
    showToast('Please upload a valid PDF file.', 'error');
    return;
  }

  uploadedFileName = file.name;
  fileName.textContent = file.name;
  fileSize.textContent = formatBytes(file.size);
  show(fileList);
  clearError();
  hide(summaryOutput);
  hide(resultsArea);

  await extractPdfText(file);
  showToast(`"${file.name}" loaded successfully!`, 'success');
}

function useDemoContent() {
  documentText = DEMO_PARAGRAPHS.join('\n\n');
  docChunks = [...DEMO_PARAGRAPHS];
  pageCount = 1;
  hasRealDocument = false;
  hide(docStats);
}

function removeFile() {
  hide(fileList);
  hide(resultsArea);
  hide(summaryOutput);
  hide(docStats);
  hide(progressWrap);
  clearError();
  documentText = '';
  uploadedFileName = '';
  docChunks = [];
  pageCount = 0;
  hasRealDocument = false;
  fileInput.value = '';
  useDemoContent();
  showToast('File removed.', 'info');
}

// Drop zone events
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

removeFileBtn.addEventListener('click', removeFile);

// --------- SEARCH ---------
function performSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    showToast('Please enter a search query.', 'info');
    return;
  }

  if (!hasRealDocument && docChunks.length === 0) {
    showToast('Upload a document first to search.', 'info');
    return;
  }

  const chunks = docChunks.length > 0 ? docChunks : DEMO_PARAGRAPHS;
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

  const scored = chunks
    .map((chunk) => {
      const lower = chunk.toLowerCase();
      let score = 0;
      // Full phrase match bonus
      if (lower.includes(lowerQuery)) score += 5;
      // Individual word matches
      score += queryWords.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
      return { chunk, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const results = scored.length > 0
    ? scored
    : [];

  resultsList.innerHTML = '';
  resultsCount.textContent = results.length;

  if (results.length === 0) {
    resultsList.innerHTML = '<div class="no-results">No matching content found. Try different keywords.</div>';
  } else {
    const safeName = escapeHtml(uploadedFileName || 'Document');
    results.forEach(({ chunk }, idx) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.style.animationDelay = `${idx * 0.06}s`;
      card.innerHTML = `
        <div class="result-card-top">
          <span class="result-match-icon">📌</span>
          <span class="result-source">${safeName} — Excerpt ${idx + 1}</span>
        </div>
        <p class="result-text">${highlightQuery(chunk, query)}</p>
      `;
      resultsList.appendChild(card);
    });
  }

  show(resultsArea);
}

searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch();
});

// --------- API KEY TOGGLE ---------
toggleKey.addEventListener('click', () => {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleKey.textContent = '🙈';
  } else {
    apiKeyInput.type = 'password';
    toggleKey.textContent = '👁';
  }
});

// Persist API key in sessionStorage
apiKeyInput.addEventListener('input', () => {
  sessionStorage.setItem('findly_key', apiKeyInput.value);
});

const savedKey = sessionStorage.getItem('findly_key');
if (savedKey) apiKeyInput.value = savedKey;

// --------- AI SUMMARY (OpenAI with Streaming) ---------
async function generateSummary() {
  clearError();
  hide(summaryOutput);

  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    showToast('Please enter your OpenAI API key first.', 'error');
    showError('Please enter your OpenAI API key first.');
    return;
  }

  if (!apiKey.startsWith('sk-')) {
    showToast('Invalid API key format. It should start with "sk-".', 'error');
    showError('Invalid API key format. It should start with "sk-".');
    return;
  }

  const context = documentText || DEMO_PARAGRAPHS.join('\n\n');
  const textToSummarize = context.slice(0, 4000);

  show(spinner);
  summarizeBtn.disabled = true;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert document analyst. Provide a concise, well-structured summary of the document content. Focus on key insights, main topics, and important findings. Use clear paragraphs. Keep the summary between 100-250 words.',
          },
          {
            role: 'user',
            content: `Please summarize the following document content:\n\n${textToSummarize}`,
          },
        ],
        max_tokens: 400,
        temperature: 0.4,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData?.error?.message || `API error: ${response.status}`;
      throw new Error(message);
    }

    // STREAMING RESPONSE
    hide(spinner);
    summaryText.textContent = '';
    summaryText.classList.add('typing');
    show(summaryOutput);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullSummary = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            fullSummary += content;
            summaryText.textContent = fullSummary;
          }
        } catch {
          // skip malformed JSON chunks
        }
      }
    }

    summaryText.classList.remove('typing');

    if (!fullSummary.trim()) {
      throw new Error('No summary returned. Please try again.');
    }

    showToast('Summary generated successfully!', 'success');

  } catch (err) {
    hide(spinner);
    summaryText.classList.remove('typing');

    const msg = err.message || 'Something went wrong. Please check your API key and try again.';
    showError(msg);
    showToast(msg, 'error', 5000);
  } finally {
    summarizeBtn.disabled = false;
  }
}

summarizeBtn.addEventListener('click', generateSummary);

// --------- COPY SUMMARY ---------
copyBtn.addEventListener('click', async () => {
  const text = summaryText.textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '✅ Copied!';
    showToast('Summary copied to clipboard!', 'success');
    setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
  } catch {
    copyBtn.textContent = '⚠️ Failed';
    showToast('Failed to copy. Try selecting the text manually.', 'error');
    setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
  }
});

// --------- KEYBOARD SHORTCUTS ---------
document.addEventListener('keydown', (e) => {
  // Ctrl+K → focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Ctrl+Enter → generate summary
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    generateSummary();
  }
});

// --------- INIT ---------
useDemoContent();
