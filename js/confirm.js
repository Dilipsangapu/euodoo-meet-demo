/**
 * EuodooConfirm — reusable custom confirmation dialog (no native alert/confirm/prompt).
 *
 * Injects its own markup and styles once per page; vanilla JS + CSS only.
 * Design matches Euodoo Meet's existing dialog style (white card, rounded corners,
 * soft shadow, dark backdrop).
 *
 * API:
 *   var ok = await EuodooConfirm.ask({
 *       title: 'End meeting?',
 *       description: 'Are you sure you want to end this meeting for all participants?',
 *       confirmLabel: 'End meeting',
 *       cancelLabel: 'Cancel',
 *       danger: true,                       // red destructive confirm button
 *       errorTitle: 'Unable to end meeting', // toast on onConfirm failure
 *       errorMessage: 'Something went wrong. Please try again.',
 *       onConfirm: function () { ... }      // optional; may return a promise.
 *   });
 *
 * ask() resolves `true` only when the user confirms AND onConfirm (if provided)
 * succeeds; otherwise it resolves `false`. When onConfirm fails the dialog stays
 * open with an error toast so the user can retry.
 *
 * Behavior: Escape, Cancel and the close icon dismiss it; the backdrop may close
 * it; clicking inside never closes it; focus moves in on open, is trapped while
 * open and restored to the previously focused element on close. While the
 * confirm handler runs, every control is disabled so repeated submissions are
 * impossible.
 */
(function () {
    'use strict';

    var CSS_TEXT = [
        '.euodoo-confirm-overlay{position:fixed;inset:0;z-index:2050;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .2s ease;}',
        '.euodoo-confirm-overlay.show{opacity:1;pointer-events:auto;}',
        '.euodoo-confirm-card{background:#fff;border-radius:18px;padding:24px;width:380px;max-width:92vw;box-shadow:0 24px 64px -18px rgba(15,32,39,.45);text-align:center;position:relative;transform:scale(.96);transition:transform .2s ease;}',
        '.euodoo-confirm-overlay.show .euodoo-confirm-card{transform:scale(1);}',
        '.euodoo-confirm-close{position:absolute;top:12px;right:12px;width:28px;height:28px;border:none;border-radius:8px;background:transparent;color:#718893;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}',
        '.euodoo-confirm-close:hover{background:#F0F7F8;color:#17333D;}',
        '.euodoo-confirm-close:focus-visible{outline:2px solid #0FA49A;outline-offset:1px;}',
        '.euodoo-confirm-title{font-size:18px;font-weight:700;color:#17333D;margin:4px 0 8px;}',
        '.euodoo-confirm-desc{font-size:13.5px;line-height:1.55;color:#64748b;margin:0 0 20px;}',
        '.euodoo-confirm-actions{display:flex;gap:12px;}',
        '.euodoo-confirm-btn{flex:1;padding:10px 12px;border-radius:9999px;font-size:13.5px;font-weight:600;border:none;cursor:pointer;transition:background .15s ease,box-shadow .15s ease;}',
        '.euodoo-confirm-btn:focus-visible{outline:2px solid #0FA49A;outline-offset:2px;}',
        '.euodoo-confirm-btn-cancel{background:#f1f5f9;color:#334155;}',
        '.euodoo-confirm-btn-cancel:hover{background:#e2e8f0;}',
        '.euodoo-confirm-btn-confirm{background:#0FA49A;color:#fff;}',
        '.euodoo-confirm-btn-confirm:hover{background:#0B8478;}',
        '.euodoo-confirm-btn-confirm.danger{background:#DC2626;box-shadow:0 4px 12px rgba(220,38,38,.28);}',
        '.euodoo-confirm-btn-confirm.danger:hover{background:#B91C1C;}',
        '.euodoo-confirm-btn:disabled{opacity:.6;cursor:default;pointer-events:none;}',
        '@media (prefers-reduced-motion:reduce){.euodoo-confirm-overlay,.euodoo-confirm-card{transition:none;}}'
    ].join('\n');

    var overlay = null;
    var card = null;
    var lastFocus = null;
    var busy = false;
    var openedAt = 0;
    var ESCAPE_HOLD_OFF_MS = 120; // Shim: ignore Escape pressed in the same instant the dialog opened

    function ensureMarkup() {
        if (overlay && document.body.contains(overlay)) return;
        if (!document.getElementById('euodoo-confirm-styles')) {
            var style = document.createElement('style');
            style.id = 'euodoo-confirm-styles';
            style.textContent = CSS_TEXT;
            document.head.appendChild(style);
        }
        overlay = document.createElement('div');
        overlay.className = 'euodoo-confirm-overlay';
        overlay.innerHTML =
            '<div class="euodoo-confirm-card" role="dialog" aria-modal="true" aria-labelledby="euodoo-confirm-title" aria-describedby="euodoo-confirm-desc">' +
            '  <button type="button" class="euodoo-confirm-close" aria-label="Close dialog">' +
            '    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/></svg>' +
            '  </button>' +
            '  <h3 class="euodoo-confirm-title" id="euodoo-confirm-title"></h3>' +
            '  <p class="euodoo-confirm-desc" id="euodoo-confirm-desc"></p>' +
            '  <div class="euodoo-confirm-actions">' +
            '    <button type="button" class="euodoo-confirm-btn euodoo-confirm-btn-cancel"></button>' +
            '    <button type="button" class="euodoo-confirm-btn euodoo-confirm-btn-confirm"></button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(overlay);
        card = overlay.querySelector('.euodoo-confirm-card');
        overlay.addEventListener('mousedown', e => {
            if (!busy && e.target === overlay) close(false); // backdrop click: outside the card only
        });
        overlay.addEventListener('click', e => {
            if (busy) return;
            if (e.target.closest('.euodoo-confirm-close')) return close(false);
            if (e.target.closest('.euodoo-confirm-btn-cancel')) return close(false);
            if (e.target.closest('.euodoo-confirm-btn-confirm')) return confirmAction();
        }); // clicks elsewhere inside the card match no button and do nothing — they never close the dialog
        document.addEventListener('keydown', onKeyDown, true);
    }

    function onKeyDown(e) {
        if (!overlay || !overlay.classList.contains('show')) return;
        if (e.key === 'Escape') {
            if (busy || Date.now() - openedAt < ESCAPE_HOLD_OFF_MS) return;
            e.preventDefault();
            e.stopPropagation();
            close(false);
            return;
        }
        if (e.key === 'Tab') {
            // Very small focus trap: cycle through the card's focusable controls.
            var focusables = Array.prototype.slice.call(
                card.querySelectorAll('button:not([disabled])'));
            if (!focusables.length) return;
            var first = focusables[0], last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            } else if (!card.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    var currentHandlers = {onConfirm: null, errorTitle: null, errorMessage: null};
    var resolver = null;

    function close(result) {
        if (!overlay || busy) return;
        overlay.classList.remove('show');
        var focusTarget = lastFocus;
        lastFocus = null;
        var r = resolver;
        resolver = null;
        if (r) r(result);
        if (focusTarget && document.contains(focusTarget)) focusTarget.focus();
    }

    function setBusy(on) {
        busy = on;
        card.querySelectorAll('.euodoo-confirm-btn').forEach(b => b.disabled = on);
        card.querySelector('.euodoo-confirm-close').disabled = on;
    }

    function confirmAction() {
        if (busy) return; // guard against repeated clicks / double submissions
        var onConfirm = currentHandlers.onConfirm;
        var done = ok => {
            setBusy(false);
            close(ok !== false && ok !== null ? true : false);
        };
        if (typeof onConfirm !== 'function') return done(true);
        setBusy(true);
        try {
            Promise.resolve(onConfirm()).then(done).catch(() => {
                // Keep the dialog open so the user can retry; inform with a toast.
                setBusy(false);
                if (window.EuodooToast) {
                    EuodooToast.error(currentHandlers.errorTitle || 'Unable to complete',
                        currentHandlers.errorMessage || 'Something went wrong. Please try again.');
                }
            });
        } catch (err) {
            setBusy(false);
            if (window.EuodooToast) {
                EuodooToast.error(currentHandlers.errorTitle || 'Unable to complete',
                    currentHandlers.errorMessage || 'Something went wrong. Please try again.');
            }
        }
    }

    /**
     * Returns a Promise<boolean>. Resolves true only after a confirmed +
     * successful onConfirm; false when cancelled or failed.
     */
    function ask(opts) {
        opts = opts || {};
        ensureMarkup();
        if (overlay.classList.contains('show')) return Promise.resolve(false); // one dialog at a time
        card.querySelector('.euodoo-confirm-title').textContent = opts.title || 'Are you sure?';
        var desc = card.querySelector('.euodoo-confirm-desc');
        if (opts.description) {
            desc.hidden = false;
            desc.textContent = opts.description;
        } else desc.hidden = true;
        var cancelBtn = card.querySelector('.euodoo-confirm-btn-cancel');
        var confirmBtn = card.querySelector('.euodoo-confirm-btn-confirm');
        cancelBtn.textContent = opts.cancelLabel || 'Cancel';
        confirmBtn.textContent = opts.confirmLabel || 'Confirm';
        confirmBtn.classList.toggle('danger', !!opts.danger);
        currentHandlers.onConfirm = opts.onConfirm || null;
        currentHandlers.errorTitle = opts.errorTitle || null;
        currentHandlers.errorMessage = opts.errorMessage || null;
        setBusy(false);
        lastFocus = document.activeElement;
        openedAt = Date.now();
        return new Promise(resolve => {
            resolver = resolve;
            void overlay.offsetWidth; // commit initial styles so the transition plays
            overlay.classList.add('show');
            confirmBtn.focus();
        });
    }

    window.EuodooConfirm = {ask: ask};
})();
