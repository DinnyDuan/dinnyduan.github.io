/**
 * i18n.js — Bilingual (EN/ZH) language switcher
 * Icon style: A/文 speech bubble, same size/color as nav Font Awesome icons
 * Title consistency: dynamically adjusts Chinese title letter-spacing to match EN width
 */

(function () {
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  // Store EN widths keyed by element reference
  var enWidthMap = new WeakMap();

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  /**
   * Measure the pixel width of a string rendered in the same font as `el`,
   * using an off-screen canvas for accuracy.
   */
  function measureTextWidth(el, text) {
    var canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement('canvas'));
    var ctx = canvas.getContext('2d');
    var style = window.getComputedStyle(el);
    ctx.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
    return ctx.measureText(text).width;
  }

  /**
   * After switching to Chinese, adjust letter-spacing on each .section-title
   * and .page-title so its rendered width equals the stored English width.
   *
   * Formula:
   *   targetWidth = enWidth
   *   zhBaseWidth = measureTextWidth(el, zhText)   // without any spacing
   *   charCount   = zhText.length
   *   letterSpacing = (targetWidth - zhBaseWidth) / charCount
   */
  function adjustZhTitleSpacing() {
    var selectors = '.section-title, .page-title, .subsection-title, .cv-section-title';
    document.querySelectorAll(selectors).forEach(function (el) {
      var zhText = el.getAttribute('data-zh');
      var enText = el.getAttribute('data-en');
      if (!zhText || !enText) return;

      // Reset spacing first so measurement is clean
      el.style.letterSpacing = '';

      var enWidth = enWidthMap.get(el);
      if (!enWidth) return;

      var zhBaseWidth = measureTextWidth(el, zhText);
      var charCount = zhText.length;
      if (charCount < 1) return;

      var spacing = (enWidth - zhBaseWidth) / charCount;
      // Only add spacing if positive (ZH is narrower than EN)
      if (spacing > 0) {
        el.style.letterSpacing = spacing.toFixed(2) + 'px';
      } else {
        el.style.letterSpacing = '';
      }
    });
  }

  /**
   * Capture EN widths for all bilingual titles (call once while page is in EN).
   */
  function captureEnWidths() {
    var selectors = '.section-title, .page-title, .subsection-title, .cv-section-title';
    document.querySelectorAll(selectors).forEach(function (el) {
      var enText = el.getAttribute('data-en');
      if (!enText) return;
      // Reset any previous spacing
      el.style.letterSpacing = '';
      var w = measureTextWidth(el, enText);
      if (w > 0) enWidthMap.set(el, w);
    });
  }

  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
      if (text !== null) el.innerHTML = text;
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Adjust letter-spacing after content switch
    if (lang === 'zh') {
      adjustZhTitleSpacing();
    } else {
      // Reset all letter-spacing when switching back to EN
      var selectors = '.section-title, .page-title, .subsection-title, .cv-section-title';
      document.querySelectorAll(selectors).forEach(function (el) {
        el.style.letterSpacing = '';
      });
    }

    var btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换为中文');
      var bubbleA   = btn.querySelector('.bubble-a rect');
      var textA     = btn.querySelector('.bubble-a text');
      var bubbleZh  = btn.querySelector('.bubble-zh rect');
      var textZh    = btn.querySelector('.bubble-zh text');
      if (lang === 'zh') {
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

  function buildIcon() {
    return [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18" aria-hidden="true">',
      '<g class="bubble-a">',
      '  <rect x="0.5" y="0.5" width="12" height="10" rx="2.5" ry="2.5" fill="currentColor" stroke="none"/>',
      '  <polygon points="2,10.5 5,10.5 2,14" fill="currentColor"/>',
      '  <text x="6.5" y="9" text-anchor="middle" font-size="7" font-weight="700"',
      '        fill="white" font-family="Georgia,serif" dominant-baseline="auto">A</text>',
      '</g>',
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

    // Always capture EN widths first (page starts in EN by default)
    // If stored lang is ZH, we still capture EN widths before switching
    var storedLang = getLang();
    if (storedLang === 'zh') {
      // Temporarily ensure EN text is in DOM for measurement
      document.querySelectorAll('[data-en]').forEach(function (el) {
        var enText = el.getAttribute('data-en');
        if (enText !== null) el.innerHTML = enText;
      });
    }

    // Capture EN widths while DOM shows EN content
    captureEnWidths();

    // Now apply the stored language
    applyLang(storedLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
