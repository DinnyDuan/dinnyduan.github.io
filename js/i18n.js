/**
 * i18n.js — Bilingual (EN/ZH) language switcher
 * - Icon: A/文 speech bubble, same size/color as nav Font Awesome icons
 * - Nav items: fixed width (EN width) so position stays identical in both languages
 * - Section titles: dynamic letter-spacing to match EN width
 */

(function () {
  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  // Store EN widths keyed by element reference
  var enWidthMap = new WeakMap();
  // Store EN nav-item widths (li elements)
  var navEnWidths = [];

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
   * Capture EN widths for nav <li> items while page shows EN text.
   * Store the full <li> width so ZH items get the same container width.
   */
  function captureNavEnWidths() {
    navEnWidths = [];
    var items = document.querySelectorAll('.nav-links li');
    items.forEach(function (li) {
      navEnWidths.push(li.getBoundingClientRect().width);
    });
  }

  /**
   * Apply fixed widths on nav <li> items.
   * EN mode: each li gets its own captured EN width for stability.
   * ZH mode: all li get the same uniform width (max ZH item width) for even spacing.
   */
  function applyNavFixedWidths(lang) {
    var items = document.querySelectorAll('.nav-links li');
    if (lang === 'zh') {
      // Clear inline widths first so browser can reflow to natural ZH sizes
      items.forEach(function (li) {
        li.style.minWidth = '';
        li.style.width = '';
      });
      // Measure after reflow, then apply uniform width
      requestAnimationFrame(function () {
        var maxW = 0;
        items.forEach(function (li) {
          var w = li.getBoundingClientRect().width;
          if (w > maxW) maxW = w;
        });
        if (maxW > 0) {
          items.forEach(function (li) {
            li.style.width = maxW + 'px';
            li.style.minWidth = maxW + 'px';
          });
        }
      });
    } else {
      items.forEach(function (li, i) {
        var w = navEnWidths[i];
        if (w && w > 0) {
          li.style.minWidth = w + 'px';
          li.style.width = w + 'px';
        }
      });
    }
  }

  /**
   * After switching to Chinese, reset letter-spacing on titles to natural.
   * We no longer stretch Chinese text to match English width.
   */
  function adjustZhTitleSpacing() {
    var selectors = '.section-title, .page-title, .subsection-title, .cv-section-title';
    document.querySelectorAll(selectors).forEach(function (el) {
      el.style.letterSpacing = '0';
    });
  }

  /**
   * Capture EN widths for all bilingual section titles.
   */
  function captureEnWidths() {
    var selectors = '.section-title, .page-title, .subsection-title, .cv-section-title';
    document.querySelectorAll(selectors).forEach(function (el) {
      var enText = el.getAttribute('data-en');
      if (!enText) return;
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

    // Apply fixed nav widths for EN; clear them for ZH so flex distributes evenly
    applyNavFixedWidths(lang);

    // Adjust nav link letter-spacing: Chinese characters don't need EN-style tracking
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.style.letterSpacing = lang === 'zh' ? '0' : '';
    });

    // Adjust section title letter-spacing
    if (lang === 'zh') {
      adjustZhTitleSpacing();
    } else {
      var selectors = '.section-title, .page-title, .subsection-title, .cv-section-title';
      document.querySelectorAll(selectors).forEach(function (el) {
        el.style.letterSpacing = '';
      });
    }

    var btn = document.getElementById('lang-toggle-btn');
    if (btn) {
      btn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换为中文');
      var bubbleA = btn.querySelector('.bubble-a rect');
      var textA = btn.querySelector('.bubble-a text');
      var bubbleZh = btn.querySelector('.bubble-zh rect');
      var textZh = btn.querySelector('.bubble-zh text');
      if (lang === 'zh') {
        if (bubbleA) bubbleA.setAttribute('fill-opacity', '0.35');
        if (textA) textA.setAttribute('fill-opacity', '0.35');
        if (bubbleZh) bubbleZh.setAttribute('fill-opacity', '1');
        if (textZh) textZh.setAttribute('fill-opacity', '1');
      } else {
        if (bubbleA) bubbleA.setAttribute('fill-opacity', '1');
        if (textA) textA.setAttribute('fill-opacity', '1');
        if (bubbleZh) bubbleZh.setAttribute('fill-opacity', '0.35');
        if (textZh) textZh.setAttribute('fill-opacity', '0.35');
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

    var storedLang = getLang();

    // If stored lang is ZH, temporarily render EN to capture EN widths
    if (storedLang === 'zh') {
      document.querySelectorAll('[data-en]').forEach(function (el) {
        var enText = el.getAttribute('data-en');
        if (enText !== null) el.innerHTML = enText;
      });
    }

    // Capture EN widths for nav items and section titles
    captureNavEnWidths();
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
