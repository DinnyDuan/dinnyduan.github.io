/**
 * i18n.js — Bilingual (EN/ZH) language switcher
 * Usage: add data-en="English text" data-zh="中文内容" to any element
 */

(function () {
  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = 'en';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function applyLang(lang) {
    // Update all elements with data-en / data-zh
    document.querySelectorAll('[data-en]').forEach(function (el) {
      const text = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
      if (text !== null) el.innerHTML = text;
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update toggle button label
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换为中文');
      btn.querySelector('.lang-label').textContent = lang === 'zh' ? 'EN' : '中';
    }
  }

  function toggleLang() {
    const current = getLang();
    const next = current === 'en' ? 'zh' : 'en';
    setLang(next);
    applyLang(next);
  }

  function init() {
    // Inject toggle button into navbar social area
    const navSocial = document.querySelector('.nav-social');
    if (navSocial) {
      const btn = document.createElement('button');
      btn.id = 'lang-toggle-btn';
      btn.className = 'lang-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle language');
      btn.innerHTML = '<span class="lang-label">中</span>';
      btn.addEventListener('click', toggleLang);
      navSocial.insertBefore(btn, navSocial.firstChild);
    }

    // Apply current language on page load
    applyLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
