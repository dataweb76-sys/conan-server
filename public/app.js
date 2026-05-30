(function () {
  'use strict';

  const API_BASE  = window.API_BASE || '';
  const MAX_LEVEL = 60;

  function nameToColor(name) {
    let h = 5381;
    for (let i = 0; i < name.length; i++) h = ((h << 5) + h) + name.charCodeAt(i);
    const hue = 5 + (((h >>> 0) % 50));
    return `hsl(${hue}, 80%, 55%)`;
  }

  function fmtMs(ms) {
    if (!ms || ms < 0) return '–';
    const s = Math.floor(ms / 1000);
    if (s < 60)  return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60)  return `${m} min`;
    const hh = Math.floor(m / 60), mm = m % 60;
    return `${hh}h ${mm}m`;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Render jugadores ───────────────────────────────
  function renderCards(data) {
    const grid      = document.getElementById('player-grid');
    const countEl   = document.getElementById('player-count');
    const heroEl    = document.getElementById('hero-count');
    const lastUpd   = document.getElementById('last-update');
    const statusDot = document.getElementById('status-dot');
    const statusTxt = document.getElementById('status-text');

    const players = data.players || [];
    const n   = players.length;
    const now = Date.now();

    countEl.textContent = n;
    heroEl.textContent  = n;

    if (data.ok) {
      statusDot.className = 'online-dot';
      statusTxt.textContent = 'En línea';
    } else {
      statusDot.className = 'online-dot red';
      statusTxt.textContent = 'Sin respuesta';
    }

    const ts = data.ts ? new Date(data.ts) : new Date();
    lastUpd.textContent = 'Actualizado: ' + ts.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    if (!data.ok && data.error) {
      grid.innerHTML = `<div class="pg-error">⚠️ ${esc(data.error)}</div>`;
      return;
    }

    if (n === 0) {
      grid.innerHTML = `
        <div class="pg-empty">
          El exilio está vacío por ahora...<br>
          <small style="font-size:.9rem">¿Serás el primero en llegar?</small>
        </div>`;
      return;
    }

    grid.innerHTML = players.map(p => {
      const color    = nameToColor(p.name);
      const initial  = p.name.charAt(0).toUpperCase();
      const crown    = p.isLeader ? '<span class="pcard-crown">👑</span>' : '';
      const clan     = p.clan    ? `🏰 ${esc(p.clan)}`    : '&nbsp;';
      const title    = p.title   ? esc(p.title)           : '';
      const lvl      = p.level   ? p.level                : null;
      const lvlPct   = lvl       ? Math.round((lvl / MAX_LEVEL) * 100) : 0;
      const onlineMs = p.onlineSince ? (now - p.onlineSince) : (p.onlineMs || 0);

      const levelBar = lvl ? `
        <div class="pcard-level">
          <span class="level-label">Nivel</span>
          <div class="level-track">
            <div class="level-fill" style="width:${lvlPct}%; --pcolor:${color}"></div>
          </div>
          <span class="level-num">${lvl}<span style="font-size:.65em;opacity:.55"> / ${MAX_LEVEL}</span></span>
        </div>` : '';

      const titleLine = title ? `<div class="pcard-title">${title}</div>` : '';

      return `
        <div class="pcard" style="--pcolor:${color}">
          <div class="pcard-top">
            <div class="pcard-avatar" style="background:${color}">${initial}</div>
            <div class="pcard-identity">
              <span class="pcard-name">${esc(p.name)} ${crown}</span>
              <span class="pcard-clan">${clan}</span>
            </div>
            <div class="pcard-time-badge">
              <div class="pcard-online-dot"></div>
              <span class="pcard-time" data-since="${p.onlineSince || ''}">${fmtMs(onlineMs)}</span>
            </div>
          </div>
          ${titleLine}
          ${levelBar}
        </div>`;
    }).join('');
  }

  // ── Timers en vivo ─────────────────────────────────
  function tickTimers() {
    const now = Date.now();
    document.querySelectorAll('.pcard-time[data-since]').forEach(el => {
      const since = parseInt(el.dataset.since);
      if (!since || isNaN(since)) return;
      el.textContent = fmtMs(now - since);
    });
  }

  // ── Fetch players ──────────────────────────────────
  async function fetchPlayers(force) {
    try {
      if (!sbClient) { renderCards({ ok: false, players: [] }); return; }
      const { data, error } = await sbClient.from('online_players').select('*').order('level', { ascending: false });
      if (error) throw error;
      const players = (data || []).map(p => ({
        name: p.name, level: p.level, clan: p.clan,
        isLeader: p.is_leader, onlineSince: p.online_since
      }));
      renderCards({ ok: true, players, ts: new Date().toISOString() });
    } catch (_) {
      renderCards({ ok: false, error: 'No hay jugadores online', players: [] });
    }
  }

  // ── Stats (hero counters) ──────────────────────────
  async function fetchStats() {
    try {
      if (!sbClient) return;
      const { data } = await sbClient.from('characters_ranking').select('name, clan');
      const total = (data || []).length;
      const clans = new Set((data || []).filter(p => p.clan).map(p => p.clan)).size;
      const totalEl = document.getElementById('hero-total');
      const clansEl = document.getElementById('hero-clans');
      if (totalEl) totalEl.textContent = total || '–';
      if (clansEl) clansEl.textContent = clans || '–';
    } catch { /* non-critical */ }
  }

  // ── Ranking ────────────────────────────────────────
  async function fetchRanking() {
    try {
      if (!sbClient) { renderRanking([]); return; }
      const { data, error } = await sbClient.from('characters_ranking').select('*').order('level', { ascending: false }).limit(50);
      if (error) throw error;
      renderRanking((data || []).map(p => ({ name: p.name, level: p.level, clan: p.clan })));
    } catch {
      document.getElementById('rank-list').innerHTML =
        '<div class="pg-error">⚠️ No se pudo cargar el ranking.</div>';
    }
  }

  function renderRanking(players) {
    const list   = document.getElementById('rank-list');
    const banner = document.getElementById('ranking-top-banner');
    if (!players.length) {
      list.innerHTML   = '<div class="pg-empty">No hay personajes registrados aún.</div>';
      banner.innerHTML = '';
      return;
    }
    const top = players[0];
    banner.innerHTML = `
      <div class="rank-top-card">
        <div class="rank-top-badge">🏆</div>
        <div class="rank-top-info">
          <div class="rank-top-label">Personaje más poderoso</div>
          <div class="rank-top-name">${esc(top.name)}${top.online ? ' <span class="rank-top-online">● Online</span>' : ''}</div>
          <div class="rank-top-meta">${top.clan ? `🏰 ${esc(top.clan)}` : 'Sin clan'}</div>
        </div>
        <div class="rank-top-level">
          <div class="rank-top-lv-val">${top.level}</div>
          <div class="rank-top-lv-label">Nivel</div>
        </div>
      </div>`;

    list.innerHTML = players.map((p, i) => {
      const color   = nameToColor(p.name);
      const initial = p.name.charAt(0).toUpperCase();
      const pill    = p.online
        ? `<span class="rank-online-pill"><span class="dot"></span>Online</span>` : '';
      return `
        <div class="rank-item${i < 3 ? ' rank-top3' : ''}">
          <span class="rank-num">${i + 1}</span>
          <div class="rank-avatar" style="background:${color}">${initial}</div>
          <div class="rank-identity">
            <div class="rank-name">${esc(p.name)}${i === 0 ? ' 👑' : ''}</div>
            <div class="rank-clan">${p.clan ? `🏰 ${esc(p.clan)}` : 'Sin clan'}</div>
          </div>
          ${pill}
          <div class="rank-level">
            <div class="rank-lv-num">${p.level}</div>
            <div class="rank-lv-label">Nivel</div>
          </div>
        </div>`;
    }).join('');
  }

  // ── Clanes ─────────────────────────────────────────
  async function fetchClans() {
    try {
      if (!sbClient) { renderClans([]); return; }
      const { data, error } = await sbClient.from('characters_ranking').select('name, clan, level');
      if (error) throw error;
      const { data: online } = await sbClient.from('online_players').select('name, clan, is_leader');
      const leaderMap = {};
      (online || []).filter(p => p.is_leader && p.clan).forEach(p => { leaderMap[p.clan] = p.name; });
      const clanMap = {};
      (data || []).filter(p => p.clan).forEach(p => {
        if (!clanMap[p.clan]) clanMap[p.clan] = { name: p.clan, members: 0, leader: leaderMap[p.clan] || '–' };
        clanMap[p.clan].members++;
      });
      renderClans(Object.values(clanMap).sort((a, b) => b.members - a.members));
    } catch {
      document.getElementById('clan-grid').innerHTML =
        '<div class="pg-error">⚠️ No se pudo cargar los clanes.</div>';
    }
  }

  function renderClans(clans) {
    const grid = document.getElementById('clan-grid');
    if (!clans.length) {
      grid.innerHTML = '<div class="pg-empty" style="grid-column:1/-1">No hay clanes registrados aún.</div>';
      return;
    }
    grid.innerHTML = clans.map(c => `
      <div class="clan-card">
        <div class="clan-icon">🏰</div>
        <div class="clan-name">${esc(c.name)}</div>
        <div class="clan-leader">👑&nbsp;<span>${esc(c.leader || 'Desconocido')}</span></div>
        <div class="clan-members">
          <span class="clan-members-num">${c.members}</span>
          <span class="clan-members-label">Miembro${c.members !== 1 ? 's' : ''}</span>
        </div>
      </div>`).join('');
  }

  // ── Mercado Pippi ──────────────────────────────────
  let pendingItem = null;

  async function loadShop() {
    try {
      if (!sbClient) { renderShop([]); return; }
      const { data, error } = await sbClient.from('market_items').select('*').eq('active', true).order('sort_order');
      if (error) throw error;
      renderShop(data || []);
    } catch {
      document.getElementById('shop-grid').innerHTML =
        '<div class="pg-error">⚠️ No se pudo cargar el mercado.</div>';
    }
  }

  function renderShop(items) {
    const grid = document.getElementById('shop-grid');
    if (!items.length) {
      grid.innerHTML = '<div class="pg-empty" style="grid-column:1/-1">El mercado está vacío por ahora.</div>';
      return;
    }
    grid.innerHTML = items.map(item => `
      <div class="shop-card">
        <div class="shop-emoji">${item.emoji || '📦'}</div>
        <span class="shop-cat">${esc(item.category)}</span>
        <div class="shop-name">${esc(item.name)}</div>
        <div class="shop-desc">${esc(item.description)}</div>
        <div class="shop-price"><span class="shop-price-icon">🪙</span>${item.pippi_cost ?? 0} monedas Pippi</div>
        <button class="btn-shop" data-id="${item.id}" data-name="${esc(item.name)}" data-cost="${item.pippi_cost ?? 0}"
          onclick="openShopModal(+this.dataset.id, this.dataset.name, +this.dataset.cost)">
          ✦ Solicitar Ítem
        </button>
      </div>`).join('');
  }

  window.openShopModal = function (itemId, itemName, pippiCost) {
    pendingItem = { id: itemId, name: itemName, cost: pippiCost };
    document.getElementById('shop-modal-item-name').textContent = itemName;
    const costEl = document.getElementById('shop-modal-cost');
    if (costEl) costEl.innerHTML = pippiCost
      ? `<span class="shop-price-icon">🪙</span>${pippiCost} monedas Pippi`
      : '';
    const fb = document.getElementById('shop-feedback');
    fb.className = 'form-feedback'; fb.textContent = '';

    const loginPrompt  = document.getElementById('shop-login-prompt');
    const formContent  = document.getElementById('shop-form-content');
    const charInput    = document.getElementById('shop-charname');

    if (!currentUser) {
      loginPrompt.innerHTML = `
        <p style="color:var(--c-dim);font-size:0.95rem;margin-bottom:1.2rem">Para solicitar ítems necesitás iniciar sesión o registrarte.</p>
        <div style="display:flex;gap:0.7rem;justify-content:center;flex-wrap:wrap">
          <button class="btn-secondary" onclick="closeShopModal()">Cancelar</button>
          <button class="btn-join" onclick="closeShopModal();openAuthModal('login')">Iniciar Sesión</button>
        </div>
        <p style="margin-top:0.9rem;font-size:0.85rem;color:var(--c-dim)">¿No tenés cuenta? <a href="#" style="color:var(--c-gold)" onclick="closeShopModal();openAuthModal('register');return false">Registrate</a></p>`;
      loginPrompt.style.display = '';
      formContent.style.display = 'none';
    } else if (!currentProfile?.verified) {
      loginPrompt.innerHTML = `
        <p style="color:var(--c-gold);font-size:1rem;margin-bottom:0.6rem">⚠️ Personaje no verificado</p>
        <p style="color:var(--c-dim);font-size:0.9rem;margin-bottom:1.2rem">Ingresá al servidor Conan Exiles — recibirás un mensaje de chat con tu código. Luego verificalo en tu perfil.</p>
        <div style="display:flex;gap:0.7rem;justify-content:center;flex-wrap:wrap">
          <button class="btn-secondary" onclick="closeShopModal()">Cancelar</button>
          <button class="btn-join" onclick="closeShopModal();location.href='profile.html'">Verificar en Mi Perfil</button>
        </div>`;
      loginPrompt.style.display = '';
      formContent.style.display = 'none';
    } else {
      loginPrompt.style.display = 'none';
      formContent.style.display = '';
      const charName = currentProfile.char_name || currentUser.user_metadata?.char_name || '';
      charInput.value    = charName;
      charInput.readOnly = !!charName;
      charInput.style.opacity = charName ? '0.75' : '';
      charInput.style.cursor  = charName ? 'default' : '';
    }

    document.getElementById('shop-modal').classList.add('open');
  };

  window.closeShopModal = function () {
    document.getElementById('shop-modal').classList.remove('open');
    pendingItem = null;
  };

  window.sendShopRequest = async function () {
    const characterName = document.getElementById('shop-charname').value.trim();
    const fb  = document.getElementById('shop-feedback');
    const btn = document.getElementById('shop-request-btn');
    if (!characterName) {
      fb.className = 'form-feedback err';
      fb.textContent = 'Ingresá el nombre de tu personaje.';
      return;
    }
    if (!pendingItem) return;
    const origHTML  = btn.innerHTML;
    btn.disabled    = true;
    btn.textContent = 'Enviando...';
    try {
      if (!sbClient) throw new Error('Sin conexión');
      const { error } = await sbClient.from('requests').insert({
        type: 'market', character_name: characterName,
        item_id: pendingItem.id, item_name: pendingItem.name,
        pippi_cost: pendingItem.cost, status: 'pending'
      });
      if (error) throw error;
      fb.className = 'form-feedback ok';
      fb.textContent = '¡Pedido enviado! El admin lo procesará en breve.';
      setTimeout(() => window.closeShopModal(), 2600);
    } catch {
      fb.className = 'form-feedback err';
      fb.textContent = 'No se pudo enviar el pedido.';
    }
    btn.disabled  = false;
    btn.innerHTML = origHTML;
  };

  // ── Donaciones ─────────────────────────────────────
  let pendingDonation = null;

  async function fetchDonationStats() {
    try {
      if (!sbClient) return;
      const now   = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { data } = await sbClient.from('donations').select('amount_ars, donor_name').eq('status', 'confirmed').gte('created_at', start);
      const total  = (data || []).reduce((s, r) => s + r.amount_ars, 0);
      const donors = (data || []).length;
      const pct    = Math.min(100, Math.round((total / 100000) * 100));
      const totalEl  = document.getElementById('donate-total');
      const barEl    = document.getElementById('donate-bar');
      const donorsEl = document.getElementById('donate-donors');
      if (totalEl)  totalEl.textContent  = '$' + total.toLocaleString('es-AR');
      if (barEl)    barEl.style.width    = pct + '%';
      if (donorsEl) donorsEl.textContent = donors + (donors === 1 ? ' donante este mes' : ' donantes este mes');
    } catch { /* non-critical */ }
  }

  window.openDonateModal = function (amount) {
    pendingDonation = amount;
    const amountEl = document.getElementById('donate-modal-amount');
    if (amountEl) amountEl.textContent = '$' + amount.toLocaleString('es-AR') + ' ARS';
    document.getElementById('donate-charname').value = '';
    document.getElementById('donate-message').value  = '';
    const fb = document.getElementById('donate-feedback');
    fb.className = 'form-feedback'; fb.textContent = '';
    document.getElementById('donate-modal').classList.add('open');
  };

  window.closeDonateModal = function () {
    document.getElementById('donate-modal').classList.remove('open');
    pendingDonation = null;
  };

  window.copyAlias = function () {
    const alias = 'danielmfaggi';
    (navigator.clipboard
      ? navigator.clipboard.writeText(alias)
      : Promise.reject()
    ).catch(() => {
      const el = Object.assign(document.createElement('input'), { value: alias });
      document.body.appendChild(el); el.select();
      document.execCommand('copy'); el.remove();
    }).finally(() => toast('Alias copiado: danielmfaggi ✓'));
  };

  window.sendDonation = async function () {
    if (!pendingDonation) return;
    const donorName = document.getElementById('donate-charname').value.trim() || 'Anónimo';
    const message   = document.getElementById('donate-message').value.trim();
    const fb  = document.getElementById('donate-feedback');
    const btn = document.getElementById('donate-confirm-btn');
    const origHTML  = btn.innerHTML;
    btn.disabled    = true;
    btn.textContent = 'Registrando...';
    try {
      if (!sbClient) throw new Error('Sin conexión');
      const { error } = await sbClient.from('donations').insert({
        donor_name: donorName, amount_ars: pendingDonation,
        message: message || '', status: 'pending'
      });
      if (error) throw error;
      fb.className = 'form-feedback ok';
      fb.textContent = '¡Gracias! Tu donación fue registrada. Realizá la transferencia al alias danielmfaggi.';
      setTimeout(() => { window.closeDonateModal(); fetchDonationStats(); }, 4000);
    } catch {
      fb.className = 'form-feedback err';
      fb.textContent = 'No se pudo registrar la donación.';
    }
    btn.disabled  = false;
    btn.innerHTML = origHTML;
  };

  // ── Únete al Clan ──────────────────────────────────
  window.submitJoinRequest = async function (e) {
    e.preventDefault();
    const characterName = document.getElementById('join-charname').value.trim();
    const message       = document.getElementById('join-message').value.trim();
    const fb  = document.getElementById('join-feedback');
    const btn = document.getElementById('join-submit');
    const origHTML = btn.innerHTML;
    btn.disabled   = true;
    btn.innerHTML  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg> Enviando...';
    try {
      if (!sbClient) throw new Error('Sin conexión');
      const { error } = await sbClient.from('requests').insert({
        type: 'clan', character_name: characterName,
        message: message || '', status: 'pending'
      });
      if (error) throw error;
      fb.className = 'form-feedback ok';
      fb.textContent = '¡Solicitud enviada! Te contactaremos pronto.';
      document.getElementById('join-form').reset();
    } catch {
      fb.className = 'form-feedback err';
      fb.textContent = 'No se pudo enviar la solicitud.';
    }
    btn.disabled  = false;
    btn.innerHTML = origHTML;
  };

  // ── Auth (Supabase) ───────────────────────────────
  let sbClient    = null;
  let currentUser = null;
  let currentProfile = null;

  async function refreshProfile(userId) {
    if (!userId) { currentProfile = null; return; }
    try {
      const { data } = await sbClient.from('profiles')
        .select('id, char_name, verified')
        .eq('id', userId).maybeSingle();
      currentProfile = data;
    } catch { currentProfile = null; }
  }

  function initSupabase() {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON || !window.supabase) return;
    sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON);
    sbClient.auth.onAuthStateChange(async (_e, session) => {
      const user = session?.user ?? null;
      updateAuthNav(user);
      if (_e === 'SIGNED_IN' || _e === 'USER_UPDATED') await refreshProfile(user?.id);
      else if (_e === 'SIGNED_OUT') currentProfile = null;
    });
    sbClient.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user ?? null;
      updateAuthNav(user);
      if (user) await refreshProfile(user.id);
    });
  }

  const ADMIN_EMAIL = 'datawebgames@gmail.com';

  function updateAuthNav(user) {
    currentUser = user;
    const el = document.getElementById('auth-nav');
    if (!el) return;
    if (user) {
      const name    = user.user_metadata?.char_name || user.email;
      const isAdmin = user.email === ADMIN_EMAIL;
      el.innerHTML = `
        ${isAdmin ? `<a href="admin.html" class="nav-link nav-admin">⚙️ Admin</a>` : ''}
        <a href="profile.html" class="nav-link nav-register">👤 ${esc(name)}</a>
        <a href="#" class="nav-link" onclick="doLogout();return false;">Salir</a>`;
    } else {
      el.innerHTML = `<a href="#" class="nav-link nav-register"
        onclick="openAuthModal('register');return false;">Registrarse</a>`;
    }
    // sync hero status dot
    const dot = document.getElementById('hero-status-dot');
    if (dot) dot.style.display = '';
  }

  // ── Navigation popup ──────────────────────────────
  window.openNavPopup = function () {
    document.getElementById('nav-popup').classList.add('open');
  };
  window.closeNavPopup = function () {
    document.getElementById('nav-popup').classList.remove('open');
  };
  window.navTo = function (sectionId) {
    closeNavPopup();
    const el = document.querySelector(sectionId);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };
  window.scrollToDonate = function () {
    const el = document.getElementById('donations-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Auth modal ────────────────────────────────────
  window.openAuthModal = function (tab) {
    closeNavPopup();
    switchAuthTab(tab || 'register');
    document.getElementById('auth-modal').classList.add('open');
  };
  window.closeAuthModal = function () {
    document.getElementById('auth-modal').classList.remove('open');
  };
  window.switchAuthTab = function (tab) {
    document.getElementById('auth-register-form').style.display = tab === 'register' ? '' : 'none';
    document.getElementById('auth-login-form').style.display    = tab === 'login'    ? '' : 'none';
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
    document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
    const fb = document.getElementById('auth-feedback');
    if (fb) { fb.className = 'form-feedback'; fb.textContent = ''; }
  };

  window.doRegister = async function () {
    if (!sbClient) { showAuthErr('Configurá SUPABASE_URL y SUPABASE_ANON en config.js'); return; }
    const charName = document.getElementById('auth-charname').value.trim();
    const email    = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    if (!charName || !email || !password) { showAuthErr('Completá todos los campos.'); return; }
    if (password.length < 6) { showAuthErr('La contraseña debe tener al menos 6 caracteres.'); return; }
    const btn = document.querySelector('#auth-register-form .btn-join');
    const orig = btn.innerHTML; btn.disabled = true; btn.textContent = 'Registrando...';
    try {
      const { data, error } = await sbClient.auth.signUp({
        email, password, options: { data: { char_name: charName } }
      });
      if (error) throw error;
      if (data.user) {
        const vCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await sbClient.from('profiles').insert({
          id: data.user.id, char_name: charName,
          verified: false, verification_code: vCode,
        });
        await refreshProfile(data.user.id);
      }
      showAuthOk('¡Cuenta creada! Ingresá al servidor para recibir tu código de verificación.');
      setTimeout(closeAuthModal, 3000);
    } catch (e) { showAuthErr(e.message || 'Error al registrarse.'); }
    btn.disabled = false; btn.innerHTML = orig;
  };

  window.doLogin = async function () {
    if (!sbClient) { showAuthErr('Configurá SUPABASE_URL y SUPABASE_ANON en config.js'); return; }
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) { showAuthErr('Ingresá email y contraseña.'); return; }
    const btn = document.querySelector('#auth-login-form .btn-join');
    const orig = btn.innerHTML; btn.disabled = true; btn.textContent = 'Entrando...';
    try {
      const { error } = await sbClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showAuthOk('¡Bienvenido de vuelta!');
      setTimeout(closeAuthModal, 1500);
    } catch (e) { showAuthErr(e.message || 'Email o contraseña incorrectos.'); }
    btn.disabled = false; btn.innerHTML = orig;
  };

  window.doLogout = async function () {
    if (sbClient) await sbClient.auth.signOut();
    updateAuthNav(null);
    toast('Sesión cerrada');
  };

  function showAuthErr(msg) {
    const fb = document.getElementById('auth-feedback');
    if (fb) { fb.className = 'form-feedback err'; fb.textContent = msg; }
  }
  function showAuthOk(msg) {
    const fb = document.getElementById('auth-feedback');
    if (fb) { fb.className = 'form-feedback ok'; fb.textContent = msg; }
  }

  // ── Refresco manual ────────────────────────────────
  let busy = false;
  window.refreshPlayers = function (force) {
    if (busy) return;
    busy = true;
    const icon = document.getElementById('refresh-icon');
    icon.style.cssText = 'display:inline-block;animation:spin .7s linear infinite';
    fetchPlayers(force).finally(() => {
      busy = false;
      icon.style.cssText = '';
      resetTimer();
    });
  };

  // ── Auto-refresh ───────────────────────────────────
  let timer;
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => fetchPlayers(false), 30_000);
  }

  // ── Copy IP ────────────────────────────────────────
  window.copyIP = function () {
    const ip = '190.174.183.144:7777';
    (navigator.clipboard
      ? navigator.clipboard.writeText(ip)
      : Promise.reject()
    ).catch(() => {
      const el = Object.assign(document.createElement('input'), { value: ip });
      document.body.appendChild(el); el.select();
      document.execCommand('copy'); el.remove();
    }).finally(() => toast('IP copiada: 190.174.183.144:7777 ✓'));
  };

  // ── Toast ──────────────────────────────────────────
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ── Partículas (brasas) ────────────────────────────
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 35; i++) {
      const e     = document.createElement('div');
      const size  = 1.5 + Math.random() * 3;
      const left  = Math.random() * 100;
      const bot   = Math.random() * 35;
      const dur   = 5 + Math.random() * 7;
      const delay = Math.random() * 8;
      const dx    = (Math.random() - 0.5) * 120;
      e.className = 'ember';
      e.style.cssText = `
        width:${size}px; height:${size}px;
        left:${left}%; bottom:${bot}%;
        --dur:${dur}s; --delay:${delay}s; --dx:${dx}px;
        animation-delay:${delay}s;
      `;
      container.appendChild(e);
    }
  }

  // ── Init ───────────────────────────────────────────
  initSupabase();
  initParticles();
  fetchPlayers(false);
  fetchStats();
  fetchRanking();
  fetchClans();
  loadShop();
  fetchDonationStats();
  resetTimer();
  setInterval(tickTimers, 1000);
})();
