/**
 * EuodooToast — shared, reusable toast notification component.
 *
 * One single implementation for every page (dashboard, call page, waiting room).
 * Sheets in its own styles on first use; no external dependencies; GSAP used for
 * enter/exit only if available and `prefers-reduced-motion` is not set.
 *
 * API:
 *   EuodooToast.show({ type:'success'|'error'|'warning'|'info', title, message, duration })
 *   EuodooToast.toast(message, { type, duration })   // legacy signature used by dashboard.js / Callpage.html
 *   EuodooToast.success(title, message) / .error() / .warning() / .info()
 *   window.showToast  — alias for EuodooToast.show
 */
(function () {
    'use strict';

    var TYPES = {
        success: { color: '#0FA49A', tint: '#F0FAF9', label: 'Success' },
        error: { color: '#F06422', tint: '#FEF4EE', label: 'Error' },
        warning: { color: '#C47E10', tint: '#FEF8EC', label: 'Warning' },
        info: { color: '#718893', tint: '#F2F7F9', label: 'Information' }
    };

    var ICONS = {
        success: '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 5.5 8 13.5 4 9.7"/></svg>',
        error: '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.8"/><path d="M10 6.2v4.6M10 13.6h.01"/></svg>',
        warning: '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3.4 18 16.6H2L10 3.4Z"/><path d="M10 8v3.4M10 14.2h.01"/></svg>',
        info: '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.8"/><path d="M10 9v4.6M10 6.4h.01"/></svg>'
    };

    var CSS_TEXT = [
        '.euodoo-toast-region{position:fixed;z-index:2100;top:max(72px,calc(env(safe-area-inset-top) + 12px));right:20px;display:flex;flex-direction:column;align-items:flex-end;gap:10px;pointer-events:none;max-width:min(380px,calc(100vw - 32px));}',
        '.euodoo-toast{pointer-events:auto;display:flex;align-items:flex-start;gap:10px;width:100%;max-width:380px;padding:12px 12px 12px 14px;border-radius:12px;border:1px solid #E1E8EB;background:#fff;box-shadow:0 10px 28px -12px rgba(23,51,61,.28);opacity:0;transform:translateY(-6px);transition:opacity .22s ease,transform .22s ease;position:relative;overflow:hidden;}',
        '.euodoo-toast.is-shown{opacity:1;transform:translateY(0);}',
        '.euodoo-toast.is-leaving{opacity:0;transform:translateY(-4px);}',
        '.euodoo-toast-icon{flex-shrink:0;width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-top:1px;}',
        '.euodoo-toast-body{min-width:0;flex:1;}',
        '.euodoo-toast-title{margin:0;font-size:13.5px;font-weight:700;line-height:1.35;color:#17333D;}',
        '.euodoo-toast-message{margin:2px 0 0;font-size:12.5px;line-height:1.45;color:#718893;overflow-wrap:anywhere;}',
        '.euodoo-toast-toast{font-size:13.5px;color:#17333D;}',// message-only variant keeps text prominent
        '.euodoo-toast-close{flex-shrink:0;width:24px;height:24px;margin:2px 0 0;border:none;background:transparent;color:#718893;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}',
        '.euodoo-toast-close:hover{background:#F0F7F8;color:#17333D;}',
        '.euodoo-toast-close:focus-visible{outline:2px solid #0FA49A;outline-offset:1px;}',
        '.euodoo-toast:focus-visible{outline:2px solid #0FA49A;outline-offset:2px;}',
        '@media (max-width:640px){.euodoo-toast-region{top:max(12px,env(safe-area-inset-top));left:12px;right:12px;align-items:center;}.euodoo-toast{max-width:min(420px,100%);}}',
        '@media (prefers-reduced-motion:reduce){.euodoo-toast{transition:none;transform:none;opacity:1;}.euodoo-toast.is-leaving{opacity:0;transition:none;}}'
    ].join('\n');

    var region = null;
    var lastShownKey = '';
    var lastShownAt = 0;
    var MAX_VISIBLE = 3;

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function ensureRegion() {
        if (region && document.body.contains(region)) return region;
        region = document.createElement('div');
        region.className = 'euodoo-toast-region';
        region.setAttribute('role', 'region');
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-label', 'Notifications');
        document.body.appendChild(region);
        return region;
    }

    function ensureStyles() {
        if (document.getElementById('euodoo-toast-styles')) return;
        var style = document.createElement('style');
        style.id = 'euodoo-toast-styles';
        style.textContent = CSS_TEXT;
        document.head.appendChild(style);
    }

    function dropOldest(regionEl) {
        var toasts = regionEl.querySelectorAll('.euodoo-toast');
        if (toasts.length < MAX_VISIBLE) return;
        removeToast(toasts[0]);
    }

    function removeToast(el) {
        if (!el || el.dataset.closing) return;
        el.dataset.closing = '1';
        if (el._hoverTimer) { clearTimeout(el._hoverTimer); el._hoverTimer = null; }
        if (window.gsap && !prefersReducedMotion()) {
            window.gsap.to(el, { opacity: 0, y: -6, duration: 0.18, onComplete: () => el.remove() });
        } else {
            el.classList.add('is-leaving');
            setTimeout(() => el.remove(), prefersReducedMotion() ? 90 : 220);
        }
    }

    /**
     * options: { type, title, message, duration }
     * Computes dismissal time; 'error' toasts stay longer and must be dismissed.
     */
    function show(options) {
        var o = options || {};
        var type = TYPES[o.type] ? o.type : 'info';
        var meta = TYPES[type];
        var title = typeof o.title === 'string' ? o.title : '';
        var message = typeof o.message === 'string' ? o.message : '';
        if (!title && !message) return null;

        // Duplicate guard: identical toast within 1.2s is suppressed.
        var dedupeKey = type + '|' + title + '\u0000' + message;
        var now = Date.now();
        if (dedupeKey === lastShownKey && now - lastShownAt < 1200) return null;
        lastShownKey = dedupeKey;
        lastShownAt = now;

        ensureStyles();
        var reg = ensureRegion();
        dropOldest(reg);

        var el = document.createElement('div');
        el.className = 'euodoo-toast toast-' + type;
        el.tabIndex = -1;
        el.setAttribute('role', type === 'error' ? 'alert' : 'status');
        el.style.setProperty('--toast-color', meta.color);
        if (!el.style.getPropertyValue) { /* very old browsers: fallback inline */ }

        var iconDisc = '<span class="euodoo-toast-icon" style="background:' + meta.tint + ';color:' + meta.color + '">' + ICONS[type] + '</span>';
        var bodyHtml = message
            ? (title ? '' : '') +
              '<p class="euodoo-toast-title">' + escHtml(title || meta.label) + '</p>' +
              (title ? '<p class="euodoo-toast-message">' + escHtml(message) + '</p>' : '')
            : '<p class="euodoo-toast-title">' + escHtml(title) + '</p>';
        // message-only toasts keep a single prominent text line
        if (!title && message) {
            bodyHtml = '<p class="euodoo-toast-title euodoo-toast-toast">' + escHtml(message) + '</p>';
        }

        el.innerHTML =
            '<span aria-hidden="true" style="position:absolute;left:0;top:0;bottom:0;width:3px;background:' + meta.color + '"></span>' +
            iconDisc +
            '<div class="euodoo-toast-body">' + bodyHtml + '</div>' +
            '<button type="button" class="euodoo-toast-close" aria-label="Dismiss notification">' +
            '<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/></svg>' +
            '</button>';

        reg.appendChild(el);

        var closeBtn = el.querySelector('.euodoo-toast-close');
        closeBtn.addEventListener('click', () => removeToast(el));
        el.addEventListener('keydown', e => { if (e.key === 'Escape') removeToast(el); });

        // Pause auto-dismiss while hovered so people can actually read it.
        var duration = Number(o.duration) ||
            (type === 'error' ? 7500 : type === 'warning' ? 6000 : 4000);
        var timer = null;
        var startCountdown = () => {
            if (el._hoverTimer) clearTimeout(el._hoverTimer);
            if (duration && duration > 0) {
                timer = setTimeout(() => removeToast(el), duration);
            }
        };
        var pauseCountdown = () => {
            if (timer) { clearTimeout(timer); timer = null; }
        };
        el.addEventListener('mouseenter', pauseCountdown);
        el.addEventListener('mouseleave', startCountdown);
        el._hoverTimer = timer;
        closeBtn._pauseTimer = pauseCountdown; // expose in case pages need it

        // Enter animation (GSAP if available, always honoring reduced motion).
        if (window.gsap && !prefersReducedMotion()) {
            window.gsap.fromTo(el, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out' });
            el._hoverTimer = null;
        } else {
            requestAnimationFrame(() => el.classList.add('is-shown'));
        }
        startCountdown();
        el._hoverTimer = timer;
        el._pauseTimer = pauseCountdown;
        el._startTimer = startCountdown;
        return el;
    }

    function escHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    /** Legacy signature: toast(message, { type, duration }). */
    function toast(message, opts) {
        if (message === null || message === undefined || message === '') return null;
        return show({ type: (opts && opts.type) || 'info', message: String(message), duration: opts && opts.duration });
    }

    window.EuodooToast = {
        show: show,
        toast: toast,
        success: (title, message) => show({ type: 'success', title: title, message: message }),
        error: (title, message) => show({ type: 'error', title: title, message: message }),
        warning: (title, message) => show({ type: 'warning', title: title, message: message }),
        info: (title, message) => show({ type: 'info', title: title, message: message })
    };
    window.showToast = window.showToast || show;
})();
