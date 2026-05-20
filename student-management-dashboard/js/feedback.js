// ===== FEEDBACK MODULE =====

// Load from localStorage on startup, fallback to empty array
let feedbacks = JSON.parse(localStorage.getItem('academx_feedbacks') || '[]');

function saveFeedbacks() {
  localStorage.setItem('academx_feedbacks', JSON.stringify(feedbacks));
}

function submitFeedback(e) {
  e.preventDefault();
  const id      = parseInt(document.getElementById('fb-student-id').value);
  const message = document.getElementById('fb-message').value.trim();
  const msgEl   = document.getElementById('fb-msg');

  if (!id || id < 1 || id > 999999) return flashMsg(msgEl, '❌ Enter a valid Student ID', false);
  if (!message) return flashMsg(msgEl, '❌ Message cannot be empty', false);

  const found = students.find(s => s.id === id);
  if (!found) return flashMsg(msgEl, '❌ Student ID does not exist in the system', false);

  feedbacks.push({ studentID: id, studentName: found.name, message, reply: '' });
  saveFeedbacks();
  flashMsg(msgEl, '✅ Feedback submitted successfully!', true);
  e.target.reset();
  updateFeedbackStats();
  renderProfFeedback();
  showToast('✅ Feedback submitted');
}

function renderProfFeedback() {
  const out = document.getElementById('prof-feedback-list');
  if (!out) return;

  if (feedbacks.length === 0) {
    out.innerHTML = `<div class="empty-state"><div class="empty-icon">💭</div><p>No feedback submitted yet.</p></div>`;
    return;
  }
  out.innerHTML = feedbacks.map((f, i) => `
    <div class="feedback-card">
      <div class="fb-header">
        <span class="fb-id">ID: ${f.studentID}</span>
        <span style="color:var(--text-2);font-size:.85rem;">${f.studentName || ''}</span>
      </div>
      <div class="fb-msg">${escapeHTML(f.message)}</div>
      ${f.reply
        ? `<div class="fb-reply">↩ Professor: ${escapeHTML(f.reply)}</div>`
        : `<div class="fb-no-reply">No reply yet</div>`
      }
    </div>
  `).join('');
}

function loadFeedbackForReply() {
  const id  = parseInt(document.getElementById('reply-id').value);
  const out = document.getElementById('reply-area');

  if (!id) { out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ Enter a Student ID</div>`; return; }

  const matches = feedbacks.filter(f => f.studentID === id);
  if (matches.length === 0) {
    out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ No feedback found for ID ${id}</div>`;
    return;
  }

  out.innerHTML = matches.map((f, i) => {
    const realIdx = feedbacks.indexOf(f);
    return `
      <div class="feedback-card">
        <div class="fb-header">
          <span class="fb-id">ID: ${f.studentID}</span>
          <span style="color:var(--text-2);font-size:.85rem;">${f.studentName || ''}</span>
        </div>
        <div class="fb-msg">${escapeHTML(f.message)}</div>
        ${f.reply ? `<div class="fb-reply">↩ Professor: ${escapeHTML(f.reply)}</div>` : ''}
        <div class="reply-form">
          <textarea id="reply-text-${realIdx}" placeholder="Type your reply…">${f.reply || ''}</textarea>
          <button class="btn btn-primary btn-sm" onclick="submitReply(${realIdx})">Reply</button>
        </div>
      </div>`;
  }).join('');
}

function submitReply(idx) {
  const textarea = document.getElementById(`reply-text-${idx}`);
  if (!textarea) return;
  const reply = textarea.value.trim();
  if (!reply) { showToast('❌ Reply cannot be empty', true); return; }
  feedbacks[idx].reply = reply;
  saveFeedbacks();
  renderProfFeedback();
  showToast('✅ Reply saved');
  // Refresh the reply area
  loadFeedbackForReply();
}

function viewMyFeedback() {
  const id  = parseInt(document.getElementById('myfb-id').value);
  const out = document.getElementById('my-feedback-list');

  if (!id) { out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ Enter your Student ID</div>`; return; }

  const mine = feedbacks.filter(f => f.studentID === id);
  if (mine.length === 0) {
    out.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No feedback found for your ID.</p></div>`;
    return;
  }
  out.innerHTML = mine.map(f => `
    <div class="feedback-card">
      <div class="fb-msg">"${escapeHTML(f.message)}"</div>
      ${f.reply
        ? `<div class="fb-reply">↩ Professor: ${escapeHTML(f.reply)}</div>`
        : `<div class="fb-no-reply">⏳ Awaiting professor reply…</div>`
      }
    </div>
  `).join('');
}

function updateFeedbackStats() {
  document.getElementById('stat-feedback').textContent     = feedbacks.length;
  document.getElementById('sb-feedback-count').textContent = feedbacks.length;
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}