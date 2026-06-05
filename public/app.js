(function () {
  'use strict';

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Stats (hero counters + estado del servidor) ────────
  async function fetchStats() {
    try {
      if (!sbAnon) return;

      // Jugadores online → hero-count + status dot
      const { data: online, error: e1 } = await sbAnon.from('online_players').select('name');
      if (!e1) {
        const count = (online || []).length;
        const heroCount = document.getElementById('hero-count');
        const statusDot = document.getElementById('status-dot');
        const statusTxt = document.getElementById('status-text');
        const heroDot   = document.getElementById('hero-status-dot');
        if (heroCount) heroCount.textContent = count;
        if (statusDot) statusDot.className   = 'online-dot';
        if (statusTxt) statusTxt.textContent = count > 0 ? 'En línea' : 'Sin jugadores';
        if (heroDot)   heroDot.style.display = '';
      }

      // Personajes registrados + clanes → hero-total, hero-clans
      const { data: chars, error: e2 } = await sbAnon.from('characters_ranking').select('name, clan');
      if (!e2) {
        const total = (chars || []).length;
        const clans = new Set((chars || []).filter(p => p.clan).map(p => p.clan)).size;
        const totalEl = document.getElementById('hero-total');
        const clansEl = document.getElementById('hero-clans');
        if (totalEl) totalEl.textContent = total > 0 ? total : '–';
        if (clansEl) clansEl.textContent = clans > 0 ? clans : '–';
      } else {
        console.warn('fetchStats: characters_ranking error:', e2.message);
      }
    } catch (err) {
      console.warn('fetchStats error:', err.message);
    }
  }

  // ── Donaciones ─────────────────────────────────────────
  let pendingDonation = null;

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
      setTimeout(() => window.closeDonateModal(), 4000);
    } catch {
      fb.className = 'form-feedback err';
      fb.textContent = 'No se pudo registrar la donación.';
    }
    btn.disabled  = false;
    btn.innerHTML = origHTML;
  };

  // ── Auth (Supabase) ───────────────────────────────────
  let sbClient       = null;  // cliente autenticado (auth + mutaciones)
  let sbAnon         = null;  // cliente anónimo fijo (lecturas públicas)
  let currentUser    = null;
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
    // Un solo cliente — evita conflicto Multiple GoTrueClient
    sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON);
    sbAnon   = sbClient;
    sbClient.auth.onAuthStateChange(async (_e, session) => {
      const user = session?.user ?? null;
      updateAuthNav(user);
      if ((_e === 'SIGNED_IN' || _e === 'USER_UPDATED' || _e === 'INITIAL_SESSION') && user)
        await refreshProfile(user.id);
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
  }

  // ── Navigation popup ──────────────────────────────────
  window.openNavPopup = function () {
    document.getElementById('nav-popup').classList.add('open');
  };
  window.closeNavPopup = function () {
    document.getElementById('nav-popup').classList.remove('open');
  };

  // ── Auth modal ────────────────────────────────────────
  window.openAuthModal = function (tab) {
    window.closeNavPopup();
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
      setTimeout(window.closeAuthModal, 3000);
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
      setTimeout(window.closeAuthModal, 1500);
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

  // ── Auto-refresh stats cada 30s ───────────────────────
  let statsTimer;
  function resetStatsTimer() {
    clearInterval(statsTimer);
    statsTimer = setInterval(fetchStats, 30_000);
  }

  // ── Copy IP ────────────────────────────────────────────
  window.copyIP = function () {
    const ip = '190.174.179.250:7777';
    (navigator.clipboard
      ? navigator.clipboard.writeText(ip)
      : Promise.reject()
    ).catch(() => {
      const el = Object.assign(document.createElement('input'), { value: ip });
      document.body.appendChild(el); el.select();
      document.execCommand('copy'); el.remove();
    }).finally(() => toast('IP copiada: 190.174.183.144:7777 ✓'));
  };

  // ── Toast ──────────────────────────────────────────────
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ── Partículas (brasas) ────────────────────────────────
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

  // ── Init ───────────────────────────────────────────────
  initSupabase();
  initParticles();
  fetchStats();
  resetStatsTimer();

  // ── Bfcache / tab visibility recovery ─────────────────
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      sbClient = null;
      initSupabase();
      fetchStats();
      resetStatsTimer();
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) fetchStats();
  });
})();
