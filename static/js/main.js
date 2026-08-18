// ================================================================
// GLOBAL STATE & DEFAULTS
// ================================================================
let D = window.PORTFOLIO_DATA || {};
let _pw = null;       // Admin password session token
let _skFilter = 'All';

const DEF = {
  profile: {
    firstName: 'YOUR',
    lastName: 'NAME',
    bioShort: 'Passionate MCA Student building the future, one line of code at a time.',
    bio: "I'm a passionate MCA student with a strong foundation in programming and web development. I love building innovative solutions that solve real-world problems.",
    roles: ['MCA Student', 'Python Developer', 'Flask Developer', 'C++ Programmer', 'Prompt Engineer', 'Problem Solver'],
    avatar: ''
  },
  skills: [
    { id: 1, name: 'Python', level: 85, category: 'Programming' },
    { id: 2, name: 'Flask', level: 75, category: 'Framework' },
    { id: 3, name: 'C++', level: 70, category: 'Programming' },
    { id: 4, name: 'SQL', level: 80, category: 'Database' },
    { id: 5, name: 'HTML', level: 90, category: 'Web' },
    { id: 6, name: 'CSS', level: 85, category: 'Web' },
    { id: 7, name: 'Prompt Engineering', level: 88, category: 'AI' },
    { id: 8, name: 'Presentation', level: 82, category: 'Soft Skills' },
    { id: 9, name: 'Team Leadership', level: 85, category: 'Soft Skills' },
    { id: 10, name: 'Communication', level: 80, category: 'Soft Skills' }
  ],
  projects: [
    { id: 1, title: 'Student Management System', description: 'A full-featured web application built with Python and Flask for managing student records, grades, and attendance with a robust SQL database backend.', tags: ['Python', 'Flask', 'SQL', 'HTML/CSS'], link: '#', github: '#' },
    { id: 2, title: 'AI Prompt Toolkit', description: 'A comprehensive collection of optimized prompts and templates for various AI use cases, demonstrating advanced prompt engineering techniques.', tags: ['Prompt Engineering', 'AI', 'Python'], link: '#', github: '#' }
  ],
  achievements: [
    { id: 1, title: 'Academic Excellence', description: 'Consistently ranked in top 10% of class throughout MCA program', year: '2024', icon: '🏆' },
    { id: 2, title: 'Hackathon Finalist', description: 'Reached finals in college-level coding competition with Flask solution', year: '2024', icon: '⚡' }
  ],
  gallery: [],
  contact: { email: 'your.email@example.com', phone: '+91 XXXXXXXXXX', location: 'India', github: '#', linkedin: '#', twitter: '#', instagram: '#' },
  cv: null
};

// ── API HELPERS ──────────────────────────────────────────────────────────────
let _saveTimer;
function scheduleSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(doSave, 700);
}

async function doSave() {
  if (!_pw) return;
  try {
    const r = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pw: _pw, data: D })
    });
    if (r.ok) {
      setServerStatus('ok');
      notif('✓ Saved! (Export JSON to make permanent via Git commit)');
    } else {
      const e = await r.json().catch(() => ({}));
      setServerStatus('err');
      notif('⚠ ' + (e.error || 'Save failed'), true);
    }
  } catch (err) {
    notif('⚠ Network error — server unreachable', true);
  }
}

async function loadFromServer() {
  setServerStatus('checking');
  try {
    const r = await fetch('/api/data');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    setServerStatus('ok');
    return data;
  } catch (e) {
    setServerStatus('err');
    console.warn('Server unreachable:', e);
    return null;
  }
}

function setServerStatus(state) {
  const dot = document.getElementById('srv-dot');
  const txt = document.getElementById('srv-status-text');
  if (dot) dot.setAttribute('data-state', state);
  if (txt) {
    if (state === 'ok') {
      txt.textContent = '✓ Flask Server Connected';
      txt.style.color = 'var(--c4)';
    } else if (state === 'err') {
      txt.textContent = '⚠ Cannot reach server';
      txt.style.color = 'var(--c3)';
    } else {
      txt.textContent = 'Checking Flask server status...';
      txt.style.color = 'var(--txm)';
    }
  }
}

async function checkServerStatus() {
  try {
    const r = await fetch('/api/ping');
    if (r.ok) {
      const d = await r.json();
      setServerStatus('ok');
      return d;
    }
  } catch {
    setServerStatus('err');
  }
  return null;
}

// ── DOM RENDER HELPERS ───────────────────────────────────────────────────────
function g(id) { return document.getElementById(id); }
function txt(id, v) { const e = g(id); if (e) e.textContent = v; }
function href(id, v) { const e = g(id); if (e && v && v != '#') e.href = v; }

function renderAll() {
  renderProfile();
  renderSkills();
  renderProjects();
  renderAchievements();
  renderGallery();
  renderContact();
  updateStats();
}

function renderProfile() {
  const p = D.profile || DEF.profile;
  const fn = (p.firstName || 'YOUR').toUpperCase();
  const ln = (p.lastName || 'NAME').toUpperCase();
  txt('h-first', fn);
  txt('h-last', ln);
  txt('hc-name', fn + ' ' + ln);
  txt('nav-brand', fn.slice(0, 4) + '.' + ln.slice(0, 4));
  txt('f-brand', fn + ' ' + ln);
  txt('h-bio-short', p.bioShort || DEF.profile.bioShort);
  txt('about-bio', p.bio || DEF.profile.bio);

  // Avatar
  const avatar = p.avatar;
  [['hc-av-emoji', 'hc-av-img'], ['ab-emoji', 'ab-img']].forEach(([eId, iId]) => {
    const em = g(eId), im = g(iId);
    if (avatar) {
      if (em) em.textContent = '';
      if (im) { im.src = avatar; im.style.display = 'block'; }
    } else {
      if (em) em.textContent = '🧑‍💻';
      if (im) { im.src = ''; im.style.display = 'none'; }
    }
  });

  // CV Buttons
  const cvUrl = D.cv || p.cv;
  ['cv-btn', 'cv-btn2', 'cv-btn3'].forEach(id => {
    const el = g(id);
    if (el) {
      if (cvUrl) { el.href = cvUrl; el.style.display = 'inline-flex'; }
      else el.style.display = 'none';
    }
  });

  // Hire Button
  const email = D.contact?.email;
  if (email && email != '#' && g('hire-btn')) g('hire-btn').href = 'mailto:' + email;
}

function renderSkills(filter) {
  if (filter !== undefined) _skFilter = filter;
  const cats = ['All', ...new Set((D.skills || []).map(s => s.category))];
  const filterBox = g('sk-filters');
  if (filterBox) {
    filterBox.innerHTML = cats.map(c => `<button class="sf${c === _skFilter ? ' on' : ''}" onclick="renderSkills('${c}')">${c}</button>`).join('');
  }
  const list = _skFilter === 'All' ? D.skills || [] : (D.skills || []).filter(s => s.category === _skFilter);
  const grid = g('sk-grid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<div class="empty"><i class="fas fa-bolt"></i>No skills added yet</div>';
    return;
  }
  grid.innerHTML = list.map(s => `
    <div class="sk-card reveal">
      <span class="sk-cat">${s.category}</span>
      <div class="sk-top"><span class="sk-name">${s.name}</span><span class="sk-pct">${s.level}%</span></div>
      <div class="sk-track"><div class="sk-fill" data-l="${s.level}" style="width:0%"></div></div>
    </div>`).join('');
  setTimeout(() => { initReveal(); animateBars(); }, 80);
}

function animateBars() {
  document.querySelectorAll('.sk-fill').forEach(b => b.style.width = b.dataset.l + '%');
}

function renderProjects() {
  const grid = g('pj-grid');
  if (!grid) return;
  if (!(D.projects || []).length) {
    grid.innerHTML = '<div class="empty"><i class="fas fa-rocket"></i>No projects yet</div>';
    return;
  }
  grid.innerHTML = D.projects.map((p, i) => `
    <div class="pj-card reveal">
      <div class="pj-num">0${i + 1}</div>
      <h3 class="pj-title">${p.title}</h3>
      <p class="pj-desc">${p.description}</p>
      <div class="pj-tags">${p.tags.map(t => `<span class="pj-tag">${t}</span>`).join('')}</div>
      <div class="pj-links">
        ${p.link && p.link != '#' ? `<a href="${p.link}" class="pj-lnk" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
        ${p.github && p.github != '#' ? `<a href="${p.github}" class="pj-lnk gh" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
        ${(!p.link || p.link == '#') && (!p.github || p.github == '#') ? `<span class="pj-lnk" style="color:var(--txd);cursor:default"><i class="fas fa-code"></i> In Progress</span>` : ''}
      </div>
    </div>`).join('');
  setTimeout(initReveal, 80);
}

function renderAchievements() {
  const grid = g('ach-grid');
  if (!grid) return;
  if (!(D.achievements || []).length) {
    grid.innerHTML = '<div class="empty"><i class="fas fa-trophy"></i>No achievements yet!</div>';
    return;
  }
  grid.innerHTML = D.achievements.map(a => `
    <div class="ach-card reveal">
      <span class="ach-ico">${a.icon}</span>
      <span class="ach-yr">${a.year}</span>
      <h3 class="ach-title">${a.title}</h3>
      <p class="ach-desc">${a.description}</p>
    </div>`).join('');
  setTimeout(initReveal, 80);
}

function renderGallery() {
  const grid = g('gal-grid');
  if (!grid) return;
  if (!(D.gallery || []).length) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><i class="fas fa-images"></i>No photos added yet</div>';
    return;
  }
  grid.innerHTML = D.gallery.map(item => `
    <div class="gal-item reveal" onclick="openLB('${item.url}')">
      <img src="${item.url}" alt="${item.caption || ''}" loading="lazy">
      <div class="gal-ov"><i class="fas fa-expand-alt"></i></div>
    </div>`).join('');
  setTimeout(initReveal, 80);
}

function renderContact() {
  const c = D.contact || DEF.contact;
  txt('c-em', c.email); txt('c-ph', c.phone); txt('c-loc', c.location);
  txt('ab-em', c.email); txt('ab-ph', c.phone); txt('ab-loc', c.location);
  txt('hc-em', c.email); txt('hc-loc', c.location);
  href('sl-gh', c.github); href('sl-li', c.linkedin); href('sl-tw', c.twitter); href('sl-ig', c.instagram);
  href('ff-gh', c.github); href('ff-li', c.linkedin); href('ff-tw', c.twitter);
  const emailEl = g('sl-em'); if (emailEl && c.email) emailEl.href = 'mailto:' + c.email;
  if (c.email && c.email != '#' && g('hire-btn')) g('hire-btn').href = 'mailto:' + c.email;
}

function updateStats() {
  txt('st-sk', (D.skills || []).length + '+');
  txt('st-pj', (D.projects || []).length + '+');
  txt('st-ac', (D.achievements || []).length + '+');
}

// ── TYPEWRITER ───────────────────────────────────────────────────────────────
let _tw;
function initTW() {
  clearInterval(_tw);
  const roles = (D.profile?.roles || DEF.profile.roles).filter(Boolean);
  const el = g('typewriter');
  if (!el) return;
  let ri = 0, ci = 0, del = false;
  function tick() {
    const cur = roles[ri] || 'Developer';
    if (del) {
      el.textContent = cur.slice(0, ci--);
      if (ci < 0) { del = false; ri = (ri + 1) % roles.length; }
    } else {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(tick, 2000); return; }
    }
    setTimeout(tick, del ? 45 : 110);
  }
  tick();
}

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const RO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      e.target.querySelectorAll('.sk-fill').forEach(b => b.style.width = b.dataset.l + '%');
    }
  });
}, { threshold: 0.08 });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => RO.observe(el));
}

// ── NAV SCROLL ───────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = g('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── ADMIN PASSWORD ───────────────────────────────────────────────────────────
function openPw() {
  g('pw-ov').classList.add('on');
  g('pw-in').value = '';
  g('pw-err').style.display = 'none';
  setTimeout(() => g('pw-in').focus(), 150);
}

function closePw() {
  g('pw-ov').classList.remove('on');
}

async function checkPw() {
  const v = g('pw-in').value;
  try {
    const r = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pw: v })
    });
    if (r.ok) {
      _pw = v;
      closePw();
      openAdmin();
    } else {
      g('pw-err').style.display = 'block';
      g('pw-in').value = '';
      g('pw-in').style.borderColor = 'var(--c3)';
      setTimeout(() => g('pw-in').style.borderColor = '', 900);
    }
  } catch {
    notif('⚠ Cannot reach server', true);
  }
}

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
function openAdmin() {
  g('ad-ov').classList.add('on');
  document.body.style.overflow = 'hidden';
  fillForms();
  renderAdminLists();
  checkServerStatus();
}

function closeAdmin() {
  g('ad-ov').classList.remove('on');
  document.body.style.overflow = '';
}

if (g('ad-ov')) {
  g('ad-ov').addEventListener('click', e => {
    if (e.target === g('ad-ov')) closeAdmin();
  });
}

function tab(name, btn) {
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.asec').forEach(s => s.classList.remove('on'));
  btn.classList.add('on');
  g('tab-' + name).classList.add('on');
}

function fillForms() {
  const p = D.profile || DEF.profile, c = D.contact || DEF.contact;
  if (g('a-fn')) g('a-fn').value = p.firstName || '';
  if (g('a-ln')) g('a-ln').value = p.lastName || '';
  if (g('a-bio-s')) g('a-bio-s').value = p.bioShort || '';
  if (g('a-bio')) g('a-bio').value = p.bio || '';
  if (g('a-roles')) g('a-roles').value = (p.roles || []).join(', ');
  if (g('a-cv')) g('a-cv').value = D.cv || '';
  if (g('a-em')) g('a-em').value = c.email || '';
  if (g('a-ph')) g('a-ph').value = c.phone || '';
  if (g('a-loc')) g('a-loc').value = c.location || '';
  if (g('a-gh')) g('a-gh').value = c.github || '';
  if (g('a-li')) g('a-li').value = c.linkedin || '';
  if (g('a-tw')) g('a-tw').value = c.twitter || '';
  if (g('a-ig')) g('a-ig').value = c.instagram || '';
  refreshAvatarPreview();
}

function renderAdminLists() {
  // Skills list
  const skList = g('a-sk-list');
  if (skList) {
    skList.innerHTML = (D.skills || []).length ? D.skills.map(s => `
      <div class="ai">
        <div class="ai-info" style="flex:1">
          <div class="ai-title">${s.name}</div>
          <div class="ai-sub">${s.category}</div>
          <div class="sk-slider-row">
            <input type="range" class="sk-slider" min="0" max="100" value="${s.level}" oninput="liveSkill(${s.id},+this.value,this.nextElementSibling)">
            <span class="sk-val">${s.level}%</span>
          </div>
        </div>
        <button class="abtn abtn-d" onclick="delSkill(${s.id})"><i class="fas fa-trash"></i></button>
      </div>`).join('') : '<div style="color:var(--txd);font-size:.8rem;font-family:\'JetBrains Mono\',monospace">No skills added yet.</div>';
  }

  // Projects list
  const pjList = g('a-pj-list');
  if (pjList) {
    pjList.innerHTML = (D.projects || []).length ? D.projects.map(p => `
      <div class="ai">
        <div class="ai-info"><div class="ai-title">${p.title}</div><div class="ai-sub">${p.tags.join(', ')}</div></div>
        <button class="abtn abtn-d" onclick="delProject(${p.id})"><i class="fas fa-trash"></i></button>
      </div>`).join('') : '<div style="color:var(--txd);font-size:.8rem;font-family:\'JetBrains Mono\',monospace">No projects yet.</div>';
  }

  // Achievements list
  const acList = g('a-ac-list');
  if (acList) {
    acList.innerHTML = (D.achievements || []).length ? D.achievements.map(a => `
      <div class="ai">
        <div class="ai-info"><div class="ai-title">${a.icon} ${a.title}</div><div class="ai-sub">${a.year}</div></div>
        <button class="abtn abtn-d" onclick="delAchievement(${a.id})"><i class="fas fa-trash"></i></button>
      </div>`).join('') : '<div style="color:var(--txd);font-size:.8rem;font-family:\'JetBrains Mono\',monospace">No achievements yet.</div>';
  }

  // Gallery list
  const galList = g('a-gal-list');
  if (galList) {
    galList.innerHTML = (D.gallery || []).length ? D.gallery.map(i => `
      <div class="ai">
        <div class="ai-info"><div class="ai-title">${i.caption || 'Photo'}</div><div class="ai-sub" style="word-break:break-all">${i.url.length > 55 ? i.url.slice(0, 55) + '...' : i.url}</div></div>
        <button class="abtn abtn-d" onclick="delPhoto('${i.id}')"><i class="fas fa-trash"></i></button>
      </div>`).join('') : '<div style="color:var(--txd);font-size:.8rem;font-family:\'JetBrains Mono\',monospace">No photos yet.</div>';
  }
}

// ── ADMIN ACTIONS ────────────────────────────────────────────────────────────
function saveProfile() {
  D.profile = D.profile || {};
  D.profile.firstName = (g('a-fn').value || 'YOUR').toUpperCase();
  D.profile.lastName = (g('a-ln').value || 'NAME').toUpperCase();
  D.profile.bioShort = g('a-bio-s').value;
  D.profile.bio = g('a-bio').value;
  D.profile.roles = g('a-roles').value.split(',').map(r => r.trim()).filter(Boolean);
  D.cv = g('a-cv').value.trim() || null;
  scheduleSave();
  renderProfile();
  initTW();
  notif('✓ Profile updated!');
}

function liveSkill(id, val, span) {
  span.textContent = val + '%';
  const s = (D.skills || []).find(x => x.id === id);
  if (s) {
    s.level = val;
    scheduleSave();
    renderSkills();
  }
}

function addSkill() {
  const name = g('ns-name').value.trim(), cat = g('ns-cat').value.trim(), level = +g('ns-lv').value;
  if (!name) { notif('⚠ Enter skill name', true); return; }
  D.skills = D.skills || [];
  D.skills.push({ id: Date.now(), name, level, category: cat || 'General' });
  scheduleSave(); renderSkills(); renderAdminLists(); updateStats();
  g('ns-name').value = ''; g('ns-cat').value = ''; g('ns-lv').value = 75; g('ns-lv-d').textContent = 75;
  notif('✓ Skill added!');
}

function delSkill(id) {
  D.skills = (D.skills || []).filter(s => s.id !== id);
  scheduleSave(); renderSkills(); renderAdminLists(); updateStats(); notif('✓ Skill removed');
}

function addProject() {
  const title = g('np-title').value.trim();
  if (!title) { notif('⚠ Enter project title', true); return; }
  D.projects = D.projects || [];
  D.projects.push({
    id: Date.now(),
    title,
    description: g('np-desc').value,
    tags: g('np-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    link: g('np-link').value || '#',
    github: g('np-gh').value || '#'
  });
  scheduleSave(); renderProjects(); renderAdminLists(); updateStats();
  ['np-title', 'np-desc', 'np-tags', 'np-link', 'np-gh'].forEach(id => g(id).value = '');
  notif('✓ Project added!');
}

function delProject(id) {
  D.projects = (D.projects || []).filter(p => p.id !== id);
  scheduleSave(); renderProjects(); renderAdminLists(); updateStats(); notif('✓ Project removed');
}

function addAchievement() {
  const title = g('na-title').value.trim();
  if (!title) { notif('⚠ Enter achievement title', true); return; }
  D.achievements = D.achievements || [];
  D.achievements.push({
    id: Date.now(),
    title,
    year: g('na-year').value || new Date().getFullYear(),
    icon: g('na-icon').value || '🏆',
    description: g('na-desc').value
  });
  scheduleSave(); renderAchievements(); renderAdminLists(); updateStats();
  ['na-title', 'na-year', 'na-icon', 'na-desc'].forEach(id => g(id).value = '');
  notif('✓ Achievement added!');
}

function delAchievement(id) {
  D.achievements = (D.achievements || []).filter(a => a.id !== id);
  scheduleSave(); renderAchievements(); renderAdminLists(); updateStats(); notif('✓ Achievement removed');
}

function addPhoto() {
  const url = g('ng-url').value.trim();
  if (!url) { notif('⚠ Enter image URL', true); return; }
  D.gallery = D.gallery || [];
  D.gallery.push({ id: Date.now().toString(), url, caption: g('ng-cap').value });
  scheduleSave(); renderGallery(); renderAdminLists();
  g('ng-url').value = ''; g('ng-cap').value = ''; notif('✓ Photo added!');
}

function delPhoto(id) {
  D.gallery = (D.gallery || []).filter(i => i.id !== id);
  scheduleSave(); renderGallery(); renderAdminLists(); notif('✓ Photo removed');
}

function saveContact() {
  D.contact = {
    email: g('a-em').value, phone: g('a-ph').value, location: g('a-loc').value,
    github: g('a-gh').value, linkedin: g('a-li').value, twitter: g('a-tw').value, instagram: g('a-ig').value
  };
  scheduleSave(); renderContact(); notif('✓ Contact info saved!');
}

async function changePw() {
  const p1 = g('s-pw1').value, p2 = g('s-pw2').value;
  if (!p1) { notif('⚠ Enter new password', true); return; }
  if (p1 !== p2) { notif('⚠ Passwords do not match', true); return; }
  D.pw = p1; _pw = p1;
  scheduleSave(); g('s-pw1').value = ''; g('s-pw2').value = ''; notif('✓ Password changed!');
}

function exportData() {
  const blob = new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'data.json';
  a.click();
  notif('✓ Downloaded data.json! Replace data.json in code & push to Vercel to make permanent.');
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      D = Object.assign(D, parsed);
      scheduleSave(); renderAll(); initTW(); renderAdminLists(); fillForms();
      notif('✓ Imported successfully!');
    } catch {
      notif('⚠ Invalid JSON file', true);
    }
  };
  reader.readAsText(file);
}

async function resetAll() {
  if (!confirm('Reset ALL portfolio data to defaults? This cannot be undone.')) return;
  try {
    const r = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pw: _pw })
    });
    if (r.ok) {
      D = JSON.parse(JSON.stringify(DEF));
      renderAll(); initTW(); renderAdminLists(); fillForms();
      notif('✓ Data reset to defaults');
    } else notif('⚠ Reset failed', true);
  } catch {
    notif('⚠ Network error', true);
  }
}

// ── LIGHTBOX ────────────────────────────────────────────────────────────────
function openLB(url) { g('lb-img').src = url; g('lb').classList.add('on'); document.body.style.overflow = 'hidden'; }
function closeLB() { g('lb').classList.remove('on'); document.body.style.overflow = ''; }

// ── CONTACT FORM ─────────────────────────────────────────────────────────────
async function submitForm() {
  const n = g('fm-name').value.trim();
  const e = g('fm-email').value.trim();
  const s = g('fm-subject').value.trim();
  const m = g('fm-msg').value.trim();
  if (!n || !e || !m) { notif('⚠ Please fill all required fields', true); return; }

  const button = document.querySelector('#contact .cf button');
  const originalButton = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, email: e, subject: s, message: m })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to send message.');
    notif('✓ Message sent! Thank you for reaching out.');
    ['fm-name', 'fm-email', 'fm-subject', 'fm-msg'].forEach(id => g(id).value = '');
  } catch (error) {
    notif('⚠ ' + (error.message || 'Unable to send message. Please try again.'), true);
  } finally {
    button.disabled = false;
    button.innerHTML = originalButton;
  }
}

// ── NOTIFICATION ─────────────────────────────────────────────────────────────
let _ntTimer;
function notif(msg, isErr = false) {
  clearTimeout(_ntTimer);
  const el = g('notif');
  if (!el) return;
  el.textContent = msg;
  el.className = 'notif' + (isErr ? ' err' : '');
  el.classList.add('show');
  _ntTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ── AVATAR UPLOAD ────────────────────────────────────────────────────────────
async function handleAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) { notif('⚠ Please select an image file', true); return; }
  if (file.size > 5 * 1024 * 1024) { notif('⚠ Image too large — max 5MB', true); return; }

  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    const thumb = g('a-av-thumb');
    thumb.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`;
    g('a-av-name').textContent = file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)';
    g('a-av-remove').style.display = 'inline-flex';
  };
  reader.readAsDataURL(file);

  const progress = g('a-av-progress');
  const bar = g('a-av-bar');
  const status = g('a-av-status');
  progress.style.display = 'block';
  bar.style.width = '30%';
  status.textContent = 'Uploading...';

  try {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('pw', _pw || '');

    bar.style.width = '60%';
    const r = await fetch('/api/upload', { method: 'POST', body: formData });
    bar.style.width = '90%';

    if (r.ok) {
      const data = await r.json();
      if (data.url) {
        D.profile = D.profile || {};
        D.profile.avatar = data.url;
        scheduleSave();
        renderProfile();
        bar.style.width = '100%';
        status.textContent = '✓ Uploaded!';
        status.style.color = 'var(--c4)';
        notif('✓ Photo uploaded successfully!');
        setTimeout(() => { progress.style.display = 'none'; bar.style.width = '0%'; status.style.color = 'var(--c1)'; }, 2000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } else {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.error || 'Server error');
    }
  } catch (e) {
    bar.style.width = '0%';
    status.textContent = '⚠ ' + e.message;
    status.style.color = 'var(--c3)';
    notif('⚠ Upload failed: ' + e.message, true);
    setTimeout(() => { progress.style.display = 'none'; status.style.color = 'var(--c1)'; }, 3000);
  }

  input.value = '';
}

function removeAvatar() {
  D.profile = D.profile || {};
  D.profile.avatar = '';
  scheduleSave();
  renderProfile();
  g('a-av-thumb').innerHTML = '🧑‍💻';
  g('a-av-name').textContent = 'No photo selected';
  g('a-av-remove').style.display = 'none';
  notif('✓ Photo removed');
}

function refreshAvatarPreview() {
  const av = D.profile?.avatar;
  const thumb = g('a-av-thumb');
  const name = g('a-av-name');
  const removeBtn = g('a-av-remove');
  if (!thumb) return;
  if (av) {
    thumb.innerHTML = `<img src="${av}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`;
    name.textContent = 'Photo saved ✓';
    if (removeBtn) removeBtn.style.display = 'inline-flex';
  } else {
    thumb.innerHTML = '🧑‍💻';
    name.textContent = 'No photo selected';
    if (removeBtn) removeBtn.style.display = 'none';
  }
}

// ── INITIALIZATION ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.PORTFOLIO_DATA || !Object.keys(window.PORTFOLIO_DATA).length) {
    const serverData = await loadFromServer();
    D = Object.assign(JSON.parse(JSON.stringify(DEF)), serverData || {});
  } else {
    D = Object.assign(JSON.parse(JSON.stringify(DEF)), window.PORTFOLIO_DATA);
  }

  renderAll();
  initTW();
  initReveal();
  setTimeout(animateBars, 400);

  // Close mobile nav on link click
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
    const links = g('navLinks');
    if (links) links.classList.remove('open');
  }));
});
