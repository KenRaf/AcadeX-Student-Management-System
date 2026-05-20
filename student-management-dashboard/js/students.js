// ===== STUDENTS MODULE =====

// Load from localStorage on startup, fallback to empty array
let students = JSON.parse(localStorage.getItem('academx_students') || '[]');

function saveStudents() {
  localStorage.setItem('academx_students', JSON.stringify(students));
}

function formatName(name) {
  return name.trim().replace(/\b\w/g, c => c.toUpperCase());
}

function isValidID(id, name) {
  for (let s of students) {
    if (s.id === id && s.name !== name) return false;
  }
  return true;
}

function addStudentForm(e) {
  e.preventDefault();
  const id       = parseInt(document.getElementById('f-id').value);
  const rawName  = document.getElementById('f-name').value;
  const year     = document.getElementById('f-year').value;
  const semester = document.getElementById('f-semester').value;
  const section  = document.getElementById('f-section').value.trim();
  const gpa      = parseFloat(document.getElementById('f-gpa').value);
  const msgEl    = document.getElementById('add-msg');

  if (!id || id < 1 || id > 999999) return flashMsg(msgEl, '❌ ID must be between 1 and 999999', false);
  if (!rawName.trim()) return flashMsg(msgEl, '❌ Name cannot be empty', false);
  if (isNaN(gpa) || gpa < 0 || gpa > 4) return flashMsg(msgEl, '❌ GPA must be between 0.0 and 4.0', false);

  const name = formatName(rawName);
  if (!isValidID(id, name)) return flashMsg(msgEl, '❌ This ID belongs to a different student', false);

  students.push({ id, name, year, semester, section, gpa });
  saveStudents();
  flashMsg(msgEl, `✅ ${name} added successfully!`, true);
  e.target.reset();
  updateStats();
  renderStudentsTable();
  showToast(`✅ Student ${name} registered`);
}

function renderStudentsTable(target = 'students-tbody', tableId = 'students-table', emptyId = 'empty-students') {
  const tbody   = document.getElementById(target);
  const table   = document.getElementById(tableId);
  const empty   = emptyId ? document.getElementById(emptyId) : null;
  if (!tbody) return;

  if (students.length === 0) {
    if (empty) empty.style.display = 'block';
    table.classList.add('hidden');
    return;
  }
  if (empty) empty.style.display = 'none';
  table.classList.remove('hidden');

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.year}</td>
      <td>${s.semester}</td>
      <td>${s.section}</td>
      <td>${gpaTag(s.gpa)}</td>
      <td>
        <button class="btn-row-edit" onclick="quickEditStudent(${s.id})">✏ Edit</button>
        <button class="btn-row-delete" onclick="quickDeleteStudent(${s.id})">🗑 Remove</button>
      </td>
    </tr>
  `).join('');
}

function gpaTag(gpa) {
  const cls = gpa >= 3.5 ? 'gpa-high' : gpa >= 2.5 ? 'gpa-mid' : 'gpa-low';
  return `<span class="gpa-badge ${cls}">${gpa.toFixed(2)}</span>`;
}

function sortByName() {
  students.sort((a, b) => a.name.localeCompare(b.name));
  saveStudents();
  renderSortTable();
  flashMsg(document.getElementById('sort-msg'), '✅ Sorted alphabetically by name', true);
  showToast('⚡ Sorted by name');
}

function sortByGPA() {
  students.sort((a, b) => b.gpa - a.gpa);
  saveStudents();
  renderSortTable();
  flashMsg(document.getElementById('sort-msg'), '✅ Sorted by GPA (highest first)', true);
  showToast('⚡ Sorted by GPA');
}

function renderSortTable() {
  const tbody = document.getElementById('sort-tbody');
  const table = document.getElementById('sort-table');
  if (!tbody || students.length === 0) return;
  table.classList.remove('hidden');
  tbody.innerHTML = students.map((s, i) => `
    <tr>
      <td>#${i + 1}</td>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.year}</td>
      <td>${gpaTag(s.gpa)}</td>
    </tr>
  `).join('');
  renderStudentsTable();
}

function searchStudent() {
  const id  = parseInt(document.getElementById('search-id').value);
  const out = document.getElementById('search-result');
  if (!id) { out.innerHTML = `<p class="flash-msg flash-error show">❌ Enter a valid ID</p>`; return; }

  const s = students.find(s => s.id === id);
  if (!s) {
    out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ No student found with ID ${id}</div>`;
    return;
  }
  out.innerHTML = `
    <div class="result-card">
      <div class="result-row"><span class="result-label">ID</span><span class="result-val">${s.id}</span></div>
      <div class="result-row"><span class="result-label">Name</span><span class="result-val">${s.name}</span></div>
      <div class="result-row"><span class="result-label">Year</span><span class="result-val">${s.year} Year</span></div>
      <div class="result-row"><span class="result-label">Semester</span><span class="result-val">${s.semester} Sem</span></div>
      <div class="result-row"><span class="result-label">Section</span><span class="result-val">${s.section}</span></div>
      <div class="result-row"><span class="result-label">GPA</span><span class="result-val">${gpaTag(s.gpa)}</span></div>
    </div>`;
}

function viewMyGPA() {
  const id  = parseInt(document.getElementById('gpa-search-id').value);
  const out = document.getElementById('gpa-result');
  if (!id) { out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ Enter your Student ID</div>`; return; }

  const s = students.find(s => s.id === id);
  if (!s) {
    out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ Student ID not found in the system</div>`;
    return;
  }

  const pct = (s.gpa / 4) * 100;
  const barColor = s.gpa >= 3.5 ? 'var(--accent)' : s.gpa >= 2.5 ? 'var(--gold)' : 'var(--red)';
  out.innerHTML = `
    <div class="result-card gold-card">
      <div class="result-row"><span class="result-label">Name</span><span class="result-val">${s.name}</span></div>
      <div class="result-row"><span class="result-label">Year & Semester</span><span class="result-val">${s.year} Year, ${s.semester} Sem</span></div>
      <div class="result-row"><span class="result-label">Section</span><span class="result-val">${s.section}</span></div>
      <div class="result-row"><span class="result-label">GPA</span><span class="result-val">${gpaTag(s.gpa)}</span></div>
      <div class="gpa-meter-wrap">
        <div class="gpa-meter-label"><span>0.0</span><span>4.0</span></div>
        <div class="gpa-meter-track">
          <div class="gpa-meter-fill" style="width:0%;background:${barColor}" id="gpa-fill"></div>
        </div>
      </div>
    </div>`;
  setTimeout(() => {
    const fill = document.getElementById('gpa-fill');
    if (fill) fill.style.width = pct + '%';
  }, 50);
}

function updateStats() {
  document.getElementById('stat-count').textContent    = students.length;
  document.getElementById('sb-student-count').textContent = students.length;
}

// ── Delete: lookup step (shows confirm card) ───────────
function lookupStudentForDelete() {
  const id  = parseInt(document.getElementById('delete-id').value);
  const out = document.getElementById('delete-preview');

  if (!id) {
    out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ Enter a valid Student ID</div>`;
    return;
  }

  const s = students.find(s => s.id === id);
  if (!s) {
    out.innerHTML = `<div class="flash-msg flash-error show" style="max-height:60px;opacity:1;padding:.6rem 1rem;">❌ No student found with ID ${id}</div>`;
    return;
  }

  const fbCount = feedbacks.filter(f => f.studentID === id).length;

  out.innerHTML = `
    <div class="delete-card">
      <div class="delete-card-header">
        <span style="font-size:1.5rem;">👤</span>
        <div>
          <h3>${s.name}</h3>
          <span style="font-size:0.8rem;color:var(--text-2);font-family:var(--font-mono);">ID: ${s.id} · ${s.year} Year · ${s.section}</span>
        </div>
      </div>
      <div class="result-row"><span class="result-label">Semester</span><span class="result-val">${s.semester} Sem</span></div>
      <div class="result-row"><span class="result-label">GPA</span><span class="result-val">${gpaTag(s.gpa)}</span></div>
      <div class="delete-warning">
        ⚠ This will permanently delete <strong>${s.name}</strong>
        ${fbCount > 0 ? ` and <strong>${fbCount} associated feedback message${fbCount > 1 ? 's' : ''}</strong>` : ' (no feedback to remove)'}.
        This action cannot be undone.
      </div>
      <div class="delete-actions">
        <button class="btn btn-danger" onclick="confirmDeleteStudent(${s.id})">🗑 YES, DELETE</button>
        <button class="btn-ghost" onclick="cancelDelete()">Cancel</button>
      </div>
    </div>`;
}

// ── Delete: confirm step ───────────────────────────────
function confirmDeleteStudent(id) {
  const s = students.find(s => s.id === id);
  if (!s) return;

  const fbRemoved = feedbacks.filter(f => f.studentID === id).length;

  // Remove student
  students = students.filter(s => s.id !== id);
  saveStudents();

  // Remove all associated feedbacks
  feedbacks = feedbacks.filter(f => f.studentID !== id);
  saveFeedbacks();

  updateStats();
  updateFeedbackStats();
  renderStudentsTable();
  renderProfFeedback();

  const out = document.getElementById('delete-preview');
  out.innerHTML = `
    <div class="flash-msg flash-success show" style="max-height:80px;opacity:1;padding:.75rem 1rem;">
      ✅ <strong>${s.name}</strong> has been deleted.
      ${fbRemoved > 0 ? `${fbRemoved} feedback message${fbRemoved > 1 ? 's' : ''} also removed.` : ''}
    </div>`;
  document.getElementById('delete-id').value = '';

  showToast(`🗑 ${s.name} deleted`);
}

// ── Delete: quick delete from the View Students table ──
function quickDeleteStudent(id) {
  const s = students.find(s => s.id === id);
  if (!s) return;

  // Switch to the delete panel and pre-fill + show confirm
  const deleteBtn = document.querySelector('.nav-btn[data-panel="delete-student"]');
  showSubPanel(deleteBtn, 'delete-student');
  document.getElementById('delete-id').value = id;
  lookupStudentForDelete();
}

// ── Update: track which student is being edited ────────
let _editingStudentID = null;

// ── Update: lookup step — fills form with current data ─
function lookupStudentForUpdate() {
  const id  = parseInt(document.getElementById('update-search-id').value);
  const msg = document.getElementById('update-msg');

  if (!id || id < 1 || id > 999999) {
    flashMsg(msg, '❌ Enter a valid Student ID', false);
    return;
  }

  const s = students.find(s => s.id === id);
  if (!s) {
    flashMsg(msg, `❌ No student found with ID ${id}`, false);
    document.getElementById('update-form-wrap').classList.add('hidden');
    return;
  }

  // Populate the banner
  document.getElementById('update-id-banner').innerHTML =
    `✏️ Editing: <strong>${s.name}</strong> &nbsp;·&nbsp; ID: ${s.id}`;

  // Pre-fill all fields with current values
  document.getElementById('u-name').value    = s.name;
  document.getElementById('u-gpa').value     = s.gpa;
  document.getElementById('u-section').value = s.section;

  // Set selects to match current year/semester
  setSelectValue('u-year',     s.year);
  setSelectValue('u-semester', s.semester);

  // Remember who we're editing
  _editingStudentID = id;

  // Show the form
  document.getElementById('update-form-wrap').classList.remove('hidden');
  msg.className = 'flash-msg'; // clear any old message
}

// ── Update: save changes ───────────────────────────────
function submitStudentUpdate(e) {
  e.preventDefault();
  const msg = document.getElementById('update-msg');

  if (_editingStudentID === null) {
    flashMsg(msg, '❌ No student selected. Search for a student first.', false);
    return;
  }

  const idx = students.findIndex(s => s.id === _editingStudentID);
  if (idx === -1) {
    flashMsg(msg, '❌ Student no longer exists.', false);
    return;
  }

  const rawName = document.getElementById('u-name').value;
  const gpa     = parseFloat(document.getElementById('u-gpa').value);
  const year    = document.getElementById('u-year').value;
  const semester= document.getElementById('u-semester').value;
  const section = document.getElementById('u-section').value.trim();

  if (!rawName.trim())               { flashMsg(msg, '❌ Name cannot be empty', false); return; }
  if (isNaN(gpa) || gpa < 0 || gpa > 4) { flashMsg(msg, '❌ GPA must be between 0.0 and 4.0', false); return; }
  if (!section)                      { flashMsg(msg, '❌ Section cannot be empty', false); return; }

  const name = formatName(rawName);
  const old  = students[idx];

  // Check if another student already has this ID with a different name
  // (ID stays the same so this mainly guards the name-change edge case)
  for (let i = 0; i < students.length; i++) {
    if (i !== idx && students[i].name === name && students[i].id !== _editingStudentID) {
      flashMsg(msg, '❌ Another student already has this name with a different ID', false);
      return;
    }
  }

  // Apply changes
  students[idx] = { ...old, name, year, semester, section, gpa };

  // Also update the studentName stored in any feedback for this student
  feedbacks.forEach(f => {
    if (f.studentID === _editingStudentID) f.studentName = name;
  });

  saveStudents();
  saveFeedbacks();
  renderStudentsTable();
  renderProfFeedback();
  updateStats();

  flashMsg(msg, `✅ ${name}'s record updated successfully!`, true);
  showToast(`✅ ${name} updated`);

  // Reset
  _editingStudentID = null;
  document.getElementById('update-form-wrap').classList.add('hidden');
  document.getElementById('update-search-id').value = '';
}

// ── Update: quick edit from the View Students table ────
function quickEditStudent(id) {
  const updateBtn = document.querySelector('.nav-btn[data-panel="update-student"]');
  showSubPanel(updateBtn, 'update-student');
  document.getElementById('update-search-id').value = id;
  lookupStudentForUpdate();
}

// ── Update: cancel ─────────────────────────────────────
function cancelUpdate() {
  _editingStudentID = null;
  document.getElementById('update-form-wrap').classList.add('hidden');
  document.getElementById('update-search-id').value = '';
  const msg = document.getElementById('update-msg');
  msg.className = 'flash-msg';
}

// ── Helper: set a <select> to a given value ────────────
function setSelectValue(id, value) {
  const sel = document.getElementById(id);
  if (!sel) return;
  for (let opt of sel.options) {
    if (value.startsWith(opt.value)) { opt.selected = true; break; }
  }
}

// ── Delete: cancel ─────────────────────────────────────
function cancelDelete() {
  document.getElementById('delete-preview').innerHTML = '';
  document.getElementById('delete-id').value = '';
}