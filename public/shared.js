'use strict';
/**
 * shared.js — Supabase + auth compartido para todas las páginas del sitio
 * Incluir DESPUÉS de supabase.min.js y config.js
 */
(function () {

  let sbClient = null;
  let sbAnon   = null; // apunta al mismo cliente — evita Multiple GoTrueClient
  window.currentUser    = null;
  window.currentProfile = null;

  /* ── Utilidades ───────────────────────────────────────── */
  window.esc = function (s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  };

  window.fmtMs = function (ms) {
    if (!ms || ms < 0) return '–';
    const s = Math.floor(ms / 1000);
    if (s < 60)  return s + 's';
    const m = Math.floor(s / 60);
    if (m < 60)  return m + ' min';
    return Math.floor(m / 60) + 'h ' + (m % 60) + 'm';
  };

  /* ── Acceso a los clientes ────────────────────────────── */
  window.getSb     = function () { return sbClient; };
  window.getSbAnon = function () { return sbAnon;   };

  /* ── refreshProfile ──────────────────────────────────── */
  window.refreshProfile = async function (userId) {
    if (!userId || !sbClient) { window.currentProfile = null; return; }
    try {
      const { data } = await sbClient.from('profiles')
        .select('id, char_name, verified, verification_code').eq('id', userId).maybeSingle();
      window.currentProfile = data;
    } catch {
      // Fallback: intentar sin columnas opcionales
      try {
        const { data } = await sbClient.from('profiles')
          .select('id, char_name').eq('id', userId).maybeSingle();
        window.currentProfile = data;
      } catch { window.currentProfile = null; }
    }
  };

  /* ── updateAuthNav ───────────────────────────────────── */
  function updateAuthNav(user) {
    window.currentUser = user;
    const el = document.getElementById('auth-nav');
    if (!el) return;
    const ADMIN = 'datawebgames@gmail.com';
    if (user) {
      const name  = user.user_metadata?.char_name || user.email;
      const admin = user.email === ADMIN
        ? '<a href="admin.html" class="nav-link" style="color:var(--c-gold-light)">⚙️ Admin</a>' : '';
      el.innerHTML =
        admin +
        `<a href="profile.html" class="nav-link nav-register">👤 ${window.esc(name)}</a>` +
        `<a href="#" class="nav-link" onclick="doLogout();return false">Salir</a>`;
    } else {
      el.innerHTML =
        `<a href="#" class="nav-link nav-register" onclick="openAuthModal('register');return false">Registrarse</a>`;
    }
  }

  /* ── initShared ──────────────────────────────────────── */
  window.initShared = function () {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON || !window.supabase) return;

    // UN SOLO cliente para todo — evita el conflicto "Multiple GoTrueClient"
    // Funciona tanto para anon como para auth (usa la misma clave anon)
    sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON);
    sbAnon   = sbClient; // alias — getSbAnon() y getSb() usan el mismo cliente
    sbClient.auth.onAuthStateChange(async function (_e, session) {
      const user = session?.user ?? null;
      updateAuthNav(user);
      if ((_e === 'SIGNED_IN' || _e === 'USER_UPDATED' || _e === 'INITIAL_SESSION') && user)
        await window.refreshProfile(user.id);
      else if (_e === 'SIGNED_OUT')
        window.currentProfile = null;
    });
    sbClient.auth.getSession().then(async function ({ data }) {
      const user = data.session?.user ?? null;
      updateAuthNav(user);
      if (user) await window.refreshProfile(user.id);
    });
  };

  /* ── Auth modal ──────────────────────────────────────── */
  window.openAuthModal = function (tab) {
    const m = document.getElementById('auth-modal');
    if (m) { window.switchAuthTab(tab || 'register'); m.classList.add('open'); }
  };
  window.closeAuthModal = function () {
    const m = document.getElementById('auth-modal');
    if (m) m.classList.remove('open');
  };
  window.switchAuthTab = function (tab) {
    const r  = document.getElementById('auth-register-form');
    const l  = document.getElementById('auth-login-form');
    const tr = document.getElementById('tab-register');
    const tl = document.getElementById('tab-login');
    if (r)  r.style.display  = tab === 'register' ? '' : 'none';
    if (l)  l.style.display  = tab === 'login'    ? '' : 'none';
    if (tr) tr.classList.toggle('active', tab === 'register');
    if (tl) tl.classList.toggle('active', tab === 'login');
    const fb = document.getElementById('auth-feedback');
    if (fb) { fb.className = 'form-feedback'; fb.textContent = ''; }
  };

  window.doRegister = async function () {
    if (!sbClient) return;
    const charName = document.getElementById('auth-charname')?.value.trim() || '';
    const email    = document.getElementById('auth-email')?.value.trim()    || '';
    const password = document.getElementById('auth-password')?.value        || '';
    if (!charName || !email || !password) { _authMsg('err','Completá todos los campos.'); return; }
    if (password.length < 6) { _authMsg('err','La contraseña debe tener al menos 6 caracteres.'); return; }
    const btn = document.querySelector('#auth-register-form .btn-join');
    const orig = btn?.innerHTML;
    if (btn) { btn.disabled = true; btn.textContent = 'Registrando...'; }
    try {
      const { data, error } = await sbClient.auth.signUp({
        email, password, options: { data: { char_name: charName } }
      });
      if (error) throw error;
      if (data.user) {
        const code = Math.random().toString(36).substring(2,8).toUpperCase();
        await sbClient.from('profiles').insert({
          id: data.user.id, char_name: charName, verified: false, verification_code: code
        });
        await window.refreshProfile(data.user.id);
      }
      _authMsg('ok','¡Cuenta creada! Ingresá al servidor para recibir tu código de verificación.');
      setTimeout(window.closeAuthModal, 3000);
    } catch (e) { _authMsg('err', e.message || 'Error al registrarse.'); }
    if (btn) { btn.disabled = false; btn.innerHTML = orig; }
  };

  window.doLogin = async function () {
    if (!sbClient) return;
    const email    = document.getElementById('login-email')?.value.trim()    || '';
    const password = document.getElementById('login-password')?.value         || '';
    if (!email || !password) { _authMsg('err','Ingresá email y contraseña.'); return; }
    const btn = document.querySelector('#auth-login-form .btn-join');
    const orig = btn?.innerHTML;
    if (btn) { btn.disabled = true; btn.textContent = 'Entrando...'; }
    try {
      const { error } = await sbClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      _authMsg('ok','¡Bienvenido de vuelta!');
      setTimeout(window.closeAuthModal, 1500);
    } catch (e) { _authMsg('err', e.message || 'Email o contraseña incorrectos.'); }
    if (btn) { btn.disabled = false; btn.innerHTML = orig; }
  };

  window.doLogout = async function () {
    if (sbClient) await sbClient.auth.signOut();
    updateAuthNav(null);
    window.toast('Sesión cerrada');
  };

  function _authMsg(type, msg) {
    const fb = document.getElementById('auth-feedback');
    if (fb) { fb.className = 'form-feedback ' + type; fb.textContent = msg; }
  }

  /* ── Toast ───────────────────────────────────────────── */
  let _toastTimer;
  window.toast = function (msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2800);
  };

  /* ── Copy IP ─────────────────────────────────────────── */
  window.copyIP = function () {
    const ip = '190.174.179.250:7777';
    (navigator.clipboard ? navigator.clipboard.writeText(ip) : Promise.reject())
      .catch(function () {
        const el = Object.assign(document.createElement('input'), { value: ip });
        document.body.appendChild(el); el.select();
        document.execCommand('copy'); el.remove();
      })
      .finally(function () { window.toast('IP copiada: ' + ip + ' ✓'); });
  };

  /* ── Bfcache recovery ────────────────────────────────── */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      sbClient = null;
      window.initShared();
      if (typeof window.onPageRefresh === 'function') window.onPageRefresh();
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && typeof window.onTabFocus === 'function') window.onTabFocus();
  });

})();
