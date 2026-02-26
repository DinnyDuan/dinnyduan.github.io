/**
 * i18n.js — Bilingual (EN/ZH) language switcher
 * Icon style: A/文 speech bubble, same size/color as nav Font Awesome icons
 */

(function () {
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
      if (text !== null) el.innerHTML = text;
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    var btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换为中文');
      // Update SVG fill colors to reflect active language
      var bubbleA   = btn.querySelector('.bubble-a rect');
      var textA     = btn.querySelector('.bubble-a text');
      var bubbleZh  = btn.querySelector('.bubble-zh rect');
      var textZh    = btn.querySelector('.bubble-zh text');
      if (lang === 'zh') {
        // Chinese active: zh bubble uses currentColor (inherits hover), A bubble dimmed
        if (bubbleA)  bubbleA.setAttribute('fill-opacity', '0.35');
        if (textA)    textA.setAttribute('fill-opacity', '0.35');
        if (bubbleZh) bubbleZh.setAttribute('fill-opacity', '1');
        if (textZh)   textZh.setAttribute('fill-opacity', '1');
      } else {
        if (bubbleA)  bubbleA.setAttribute('fill-opacity', '1');
        if (textA)    textA.setAttribute('fill-opacity', '1');
        if (bubbleZh) bubbleZh.setAttribute('fill-opacity', '0.35');
        if (textZh)   textZh.setAttribute('fill-opacity', '0.35');
      }
    }
  }

  function toggleLang() {
    var current = getLang();
    var next = current === 'en' ? 'zh' : 'en';
    setLang(next);
    applyLang(next);
  }

  /**
   * Build SVG icon that inherits `currentColor` from the button,
   * so it automatically matches the nav icon color (#757575) and
   * turns green on hover — exactly like the Font Awesome icons.
   *
   * viewBox 0 0 20 16, rendered at 1.05rem × 1.05rem via CSS.
   */
  function buildIcon() {
    return [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18" aria-hidden="true">',
      /* Left bubble (A) */
      '<g class="bubble-a">',
      '  <rect x="0.5" y="0.5" width="12" height="10" rx="2.5" ry="2.5" fill="currentColor" stroke="none"/>',
      '  <polygon points="2,10.5 5,10.5 2,14" fill="currentColor"/>',
      '  <text x="6.5" y="9" text-anchor="middle" font-size="7" font-weight="700"',
      '        fill="white" font-family="Georgia,serif" dominant-baseline="auto">A</text>',
      '</g>',
      /* Right bubble (文) */
      '<g class="bubble-zh">',
      '  <rect x="9.5" y="7.5" width="12" height="10" rx="2.5" ry="2.5" fill="currentColor" stroke="none"/>',
      '  <polygon points="20,17.5 17,17.5 20,21" fill="currentColor"/>',
      '  <text x="15.5" y="16" text-anchor="middle" font-size="7" font-weight="700"',
      '        fill="white" font-family="sans-serif" dominant-baseline="auto">文</text>',
      '</g>',
      '</svg>'
    ].join('');
  }

  function init() {
    var navSocial = document.querySelector('.nav-social');
    if (navSocial) {
      var btn = document.createElement('button');
      btn.id = 'lang-toggle-btn';
      btn.className = 'lang-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle language');
      btn.setAttribute('title', '切换为中文');
      btn.innerHTML = buildIcon();
      btn.addEventListener('click', toggleLang);
      navSocial.insertBefore(btn, navSocial.firstChild);
    }

    applyLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
