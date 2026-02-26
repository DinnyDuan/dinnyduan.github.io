/**
 * i18n.js — Bilingual (EN/ZH) language switcher
 * Icon style: A/文 speech bubble (like the translate icon)
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
      var text = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
      if (text !== null) el.innerHTML = text;
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update toggle button tooltip
    var btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换为中文');
      // Highlight active bubble
      var bubbleA = btn.querySelector('.bubble-a');
      var bubbleZh = btn.querySelector('.bubble-zh');
      if (lang === 'zh') {
        bubbleA.style.opacity = '0.55';
        bubbleZh.style.opacity = '1';
      } else {
        bubbleA.style.opacity = '1';
        bubbleZh.style.opacity = '0.55';
      }
    }
  }

  function toggleLang() {
    var current = getLang();
    var next = current === 'en' ? 'zh' : 'en';
    setLang(next);
    applyLang(next);
  }

  /* Build the SVG "A 文" translate icon */
  function buildIcon() {
    // SVG: white bubble with "A" (top-left) + blue bubble with "文" (bottom-right)
    return [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="36" height="36" aria-hidden="true">',
      /* outer rounded rect background */
      '<rect x="1" y="1" width="42" height="42" rx="10" ry="10" fill="#f0f4f8" stroke="#d0d8e4" stroke-width="1"/>',
      /* white bubble (A) - top left */
      '<g class="bubble-a">',
      '<rect x="5" y="6" width="20" height="17" rx="5" ry="5" fill="white" filter="url(#shadow)"/>',
      '<polygon points="9,23 14,23 9,28" fill="white"/>',
      '<text x="15" y="19" text-anchor="middle" font-size="11" font-weight="700" fill="#3a3a4a" font-family="Georgia,serif">A</text>',
      '</g>',
      /* blue bubble (文) - bottom right */
      '<g class="bubble-zh">',
      '<rect x="19" y="21" width="20" height="17" rx="5" ry="5" fill="#6bbfdb"/>',
      '<polygon points="35,38 30,38 35,43" fill="#6bbfdb"/>',
      '<text x="29" y="34" text-anchor="middle" font-size="11" font-weight="700" fill="white" font-family="sans-serif">文</text>',
      '</g>',
      '<defs><filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">',
      '<feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#00000022"/>',
      '</filter></defs>',
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
