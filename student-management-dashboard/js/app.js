// ===== APP.JS — Navigation & Utilities =====

// ── Navigation ──────────────────────────────────────────
function navigate(screen) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });

  const target = document.getElementById(`screen-${screen}`);
  if (!target) return;

  if (screen === 'main') {
    target.style.display = 'flex';
    target.classList.add('active');
    updateStats();
    updateFeedbackStats();
  } else if (screen === 'professor') {
    target.style.display = 'flex';
    target.classList.add('active');
    showSubPanel(
      target.querySelector('.nav-btn[data-panel="add-student"]'),
      'add-student',
      'professor'
    );
  } else if (screen === 'student') {
    target.style.display = 'flex';
    target.classList.add('active');
    showSubPanel(
      target.querySelector('.nav-btn[data-panel="view-gpa"]'),
      'view-gpa',
      'student'
    );
  }
}

// ── Sub-panel switching ─────────────────────────────────
function showSubPanel(btn, panelId, context) {
  // Deactivate all nav buttons in this sidebar
  if (btn) {
    const sidebar = btn.closest('.sidebar');
    if (sidebar) {
      sidebar.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  // Hide all sub-panels in current screen
  const screen = context === 'student'
    ? document.getElementById('screen-student')
    : document.getElementById('screen-professor');

  if (screen) {
    screen.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
  }

  const target = document.getElementById(`sub-${panelId}`);
  if (target) target.classList.add('active');

  // Refresh on open
  if (panelId === 'view-students') renderStudentsTable();
  if (panelId === 'view-feedback') renderProfFeedback();
  if (panelId === 'sort-students') {
    const t = document.getElementById('sort-table');
    if (t) t.classList.add('hidden');
    const msg = document.getElementById('sort-msg');
    if (msg) { msg.className = 'flash-msg'; msg.textContent = ''; }
  }
  if (panelId === 'search-student') {
    const r = document.getElementById('search-result');
    if (r) r.innerHTML = '';
  }
  if (panelId === 'update-student') {
    const wrap = document.getElementById('update-form-wrap');
    if (wrap) wrap.classList.add('hidden');
    const sid = document.getElementById('update-search-id');
    if (sid) sid.value = '';
    const msg = document.getElementById('update-msg');
    if (msg) { msg.className = 'flash-msg'; msg.textContent = ''; }
    if (typeof _editingStudentID !== 'undefined') _editingStudentID = null;
  }
  if (panelId === 'reply-feedback') {
    const r = document.getElementById('reply-area');
    if (r) r.innerHTML = '';
  }
  if (panelId === 'my-feedback') {
    const r = document.getElementById('my-feedback-list');
    if (r) r.innerHTML = '';
  }
  if (panelId === 'gpa-search') {
    const r = document.getElementById('gpa-result');
    if (r) r.innerHTML = '';
  }
}

// ── Flash message helper ────────────────────────────────
function flashMsg(el, text, success) {
  if (!el) return;
  el.textContent = text;
  el.className = `flash-msg show ${success ? 'flash-success' : 'flash-error'}`;
  setTimeout(() => {
    el.className = 'flash-msg';
    el.textContent = '';
  }, 3500);
}

// ── Toast helper ────────────────────────────────────────
let toastTimer;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className = `toast show${isError ? ' toast-error' : ''}`;
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ── Keyboard shortcut: Escape → main menu ───────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') navigate('main');
});

// ── Init ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navigate('main');
});