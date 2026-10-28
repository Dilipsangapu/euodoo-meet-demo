/* ======================================================================
   Section: dashboard.config.js
   ====================================================================== */
/**
 * Euodoo Meet dashboard - runtime configuration.
 *
 * Load this BEFORE dashboard.js. To override from Thymeleaf, define
 * `window.EuodooConfig = { ... }` in an inline script above this file; any
 * top-level key you provide replaces the default below (routes and api are
 * replaced as whole objects, so provide every entry you need).
 */
window.EuodooConfig = Object.assign({
    /**
     * true  �*' meetings come from js/dashboard.demo-data.js (no network calls).
     * false �*' meetings come from the REST endpoints in `api` below.
     * When you flip this to false you can also delete the demo-data script tag.
     */
    demoMode: true,

    /**
     * Demo "today", as YYYY-MM-DD. The sample data and the design reference are
     * built around Monday 26 Oct 2026. Set to null to use the visitor's real date.
     */
    referenceDate: '2026-10-26',

    /** Signed-in user. null �*' fall back to the demo user. Fill from Thymeleaf. */
    user: null,

    /** Page routes. Replace with the routes that already exist in the project. */
    routes: {
        home: '/dashboard',
        sales: '/sales',
        support: '/support',
        profile: '/profile',
        login: '/login',
        meetingRoom: function (code, title) {
            var url = 'waitingpage.html?meetingId=' + encodeURIComponent(code);
            if (title) url += '&meetingTitle=' + encodeURIComponent(title);
            return url;
        }
    },

    /**
     * REST endpoints used when demoMode is false.
     *   GET  meetings        �*' array of meeting objects (shape in README.md)
     *   POST createMeeting   �*' created meeting object (must include `code`)
     *   GET  notifications   �*' optional; set to null to hide notifications
     * Session cookie + CSRF header are sent automatically (Spring Security).
     */
    api: {
        meetings: '/api/meetings',
        createMeeting: '/api/meetings',
        notifications: null
    }
}, window.EuodooConfig || {});

/* ======================================================================
   Section: dashboard.demo-data.js
   ====================================================================== */
/**
 * Demo data for the Euodoo Meet dashboard.
 *
 * Isolated on purpose: set `demoMode: false` in dashboard.config.js and remove
 * this <script> tag once the Spring Boot API is serving real meetings.
 *
 * Meeting shape (what GET /api/meetings should return, as an array):
 *   id           string   unique id
 *   title        string
 *   date         string   YYYY-MM-DD (user's local calendar day)
 *   start        string   HH:mm, 24-hour
 *   durationMin  number
 *   team         string   e.g. "Dev team"
 *   status       string   "live" | "upcoming" | "ended" | "missed"
 *   participants string[] initials of the first few people, e.g. ["SN","SB","DS"]
 *   extra        number   how many more people are not shown (optional)
 *   code         string   meeting code, e.g. "abc-defg-hij"
 *   tone         string   "orange" | "teal" | "purple" | "gray" (optional)
 *   icon         string   Lucide icon name (optional, defaults to "video")
 */
window.EuodooDemoData = {
    user: {name: 'Kiran S', firstName: 'Kiran', initials: 'KS', role: 'User'},

    meetings: [
        // --- The five rows from the design reference --------------------------
        {
            id: 'm1', title: 'Project Discussion', date: '2026-10-26', start: '10:00', durationMin: 30,
            team: 'Dev team', status: 'live', participants: ['SN', 'SB', 'DS'], extra: 4,
            code: 'pdk-wmqe-rtn', tone: 'orange', icon: 'video'
        },
        {
            id: 'm2', title: 'Project Review', date: '2026-10-26', start: '14:00', durationMin: 45,
            team: 'Design team', status: 'upcoming', participants: ['DS', 'SN', 'SB'], extra: 4,
            code: 'prv-hzlc-xaq', tone: 'teal', icon: 'trending-up'
        },
        {
            id: 'm3', title: 'Interns Session', date: '2026-10-26', start: '16:30', durationMin: 60,
            team: 'Design & Dev', status: 'upcoming', participants: ['SR', 'RK', 'SN'], extra: 2,
            code: 'ins-bvfd-ouy', tone: 'purple', icon: 'users'
        },
        {
            id: 'm4', title: 'Standup', date: '2026-10-27', start: '09:30', durationMin: 15,
            team: 'Dev team', status: 'upcoming', participants: ['SN', 'DS', 'SB'], extra: 3,
            code: 'stn-ujgk-ecp', tone: 'teal', icon: 'life-buoy'
        },
        {
            id: 'm5', title: 'Frontend Planning', date: '2026-10-23', start: '11:00', durationMin: 90,
            team: 'Dev Team', status: 'ended', participants: ['SN', 'RK', 'SB'], extra: 8,
            code: 'fpl-qtxr-mhs', tone: 'gray', icon: 'phone'
        },

        // --- Extra records so the calendar dots match the reference ------------
        {
            id: 'm6', title: 'Sprint Kickoff', date: '2026-10-02', start: '10:30', durationMin: 45,
            team: 'Dev team', status: 'ended', participants: ['SN', 'SB', 'RK'], extra: 5,
            code: 'skf-lndw-zoa', tone: 'gray', icon: 'users'
        },
        {
            id: 'm7', title: 'Design Critique', date: '2026-10-06', start: '15:00', durationMin: 60,
            team: 'Design team', status: 'ended', participants: ['DS', 'SR', 'SN'], extra: 3,
            code: 'dcr-ypeh-vbi', tone: 'gray', icon: 'trending-up'
        },
        {
            id: 'm8', title: 'Client Demo', date: '2026-10-09', start: '11:30', durationMin: 30,
            team: 'Product', status: 'ended', participants: ['SB', 'RK', 'DS'], extra: 6,
            code: 'cld-mxfa-gkt', tone: 'gray', icon: 'video'
        },
        {
            id: 'm9', title: 'Backend Sync', date: '2026-10-14', start: '10:00', durationMin: 30,
            team: 'Dev team', status: 'missed', participants: ['SN', 'DS', 'SB'], extra: 2,
            code: 'bsy-owtc-rje', tone: 'gray', icon: 'life-buoy'
        },
        {
            id: 'm10', title: 'Release Retro', date: '2026-10-20', start: '16:00', durationMin: 45,
            team: 'Dev Team', status: 'missed', participants: ['RK', 'SB', 'SN'], extra: 4,
            code: 'rrt-qzia-nhu', tone: 'gray', icon: 'users'
        },
        {
            id: 'm11', title: 'Sprint Planning', date: '2026-10-29', start: '10:00', durationMin: 60,
            team: 'Dev team', status: 'upcoming', participants: ['SN', 'DS', 'RK'], extra: 5,
            code: 'spl-rdvb-wyk', tone: 'purple', icon: 'users'
        }
    ],

    notifications: [
        {
            id: 'n1',
            text: 'Project Discussion is live now',
            time: 'Just now',
            unread: true,
            meetingId: 'm1',
            icon: 'video'
        },
        {
            id: 'n2',
            text: 'SB shared notes for Project Review',
            time: '1 hr ago',
            unread: true,
            meetingId: 'm2',
            icon: 'trending-up'
        },
        {
            id: 'n3',
            text: 'Standup tomorrow at 9:30 AM',
            time: 'Yesterday',
            unread: false,
            meetingId: 'm4',
            icon: 'life-buoy'
        }
    ]
};

/* ======================================================================
   Section: meet-utils.js
   ====================================================================== */
/**
 * Pure helpers for the Euodoo Meet dashboard (dates, formatting, calendar maths,
 * input parsing, filtering). No DOM access, so they can be unit-tested in Node.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.MeetUtils = api;
    }
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    var DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'];
    var MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var STATUS_META = {
        live: {label: 'Live now'},
        upcoming: {label: 'Upcoming'},
        ended: {label: 'Ended'},
        missed: {label: 'Missed'}
    };
    var TAB_STATUSES = {upcoming: ['live', 'upcoming'], recent: ['ended'], missed: ['missed']};

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    /* ---- Dates ------------------------------------------------------------ */
    function toKey(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    function fromKey(key) {
        var p = String(key).split('-').map(Number);
        return new Date(p[0], p[1] - 1, p[2]);
    }

    function dayDiff(aKey, bKey) {
        return Math.round((fromKey(aKey) - fromKey(bKey)) / 86400000);
    }

    function addMonths(date, n) {
        var day = date.getDate();
        var d = new Date(date.getFullYear(), date.getMonth() + n, 1);
        var daysInTarget = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        d.setDate(Math.min(day, daysInTarget));
        return d;
    }

    function formatLongDate(d) {
        return DAYS_LONG[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS_LONG[d.getMonth()] + ' ' + d.getFullYear();
    }

    function formatShortDate(d) {
        return DAYS_SHORT[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()];
    }

    function formatDayLabel(key, todayKey) {
        var diff = dayDiff(key, todayKey);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Tomorrow';
        if (diff === -1) return 'Yesterday';
        return formatShortDate(fromKey(key));
    }

    /* ---- Times ------------------------------------------------------------ */
    function formatTime12(hhmm) {
        var p = String(hhmm).split(':').map(Number);
        var h = p[0], m = p[1] || 0;
        return (h % 12 || 12) + ':' + pad(m) + ' ' + (h >= 12 ? 'PM' : 'AM');
    }

    function addMinutes(hhmm, mins) {
        var p = String(hhmm).split(':').map(Number);
        var total = ((p[0] * 60 + (p[1] || 0) + mins) % 1440 + 1440) % 1440;
        return pad(Math.floor(total / 60)) + ':' + pad(total % 60);
    }

    function formatDuration(min) {
        if (min < 60) return min + ' min';
        var h = Math.floor(min / 60), m = min % 60;
        return m ? h + ' hr ' + m + ' min' : h + ' hr';
    }

    /** "10:00 - 10:30 AM" or "11:30 AM - 12:15 PM" */
    function formatRange(start, durationMin) {
        var a = formatTime12(start).split(' ');
        var b = formatTime12(addMinutes(start, durationMin)).split(' ');
        return a[1] === b[1] ? a[0] + ' - ' + b[0] + ' ' + b[1] : a[0] + ' ' + a[1] + ' - ' + b[0] + ' ' + b[1];
    }

    function getGreeting(hour) {
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    }

    /* ---- Calendar --------------------------------------------------------- */
    /** Monday-first month grid built from the Date API (35 or 42 cells, 28 for a perfect February). */
    function buildMonthGrid(year, month, opts) {
        opts = opts || {};
        var counts = opts.counts || {};
        var offset = (new Date(year, month, 1).getDay() + 6) % 7;
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var total = Math.ceil((offset + daysInMonth) / 7) * 7;
        var cells = [];
        for (var i = 0; i < total; i++) {
            var date = new Date(year, month, 1 - offset + i);
            var key = toKey(date);
            cells.push({
                key: key, date: date, day: date.getDate(), inMonth: date.getMonth() === month,
                isToday: key === opts.todayKey, isSelected: key === opts.selectedKey, count: counts[key] || 0
            });
        }
        return {year: year, month: month, label: MONTHS_LONG[month] + ' ' + year, cells: cells};
    }

    /* ---- Meetings --------------------------------------------------------- */
    function isJoinable(m, todayKey) {
        return m.status === 'live' || (m.status === 'upcoming' && m.date === todayKey);
    }

    function compareMeetings(a, b) {
        return a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date);
    }

    function matchesQuery(m, query, todayKey) {
        var terms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
        if (!terms.length) return true;
        var hay = [m.title, m.team, formatDayLabel(m.date, todayKey), m.code, m.participants.join(' '),
            STATUS_META[m.status] ? STATUS_META[m.status].label : m.status].join(' ').toLowerCase();
        return terms.every(function (t) {
            return hay.indexOf(t) !== -1;
        });
    }

    /** tab: "upcoming" | "recent" | "missed" | "all" */
    function filterMeetings(meetings, opts, todayKey) {
        var tab = opts.tab || 'all';
        var list = meetings.filter(function (m) {
            var inTab = tab === 'all' || (TAB_STATUSES[tab] || []).indexOf(m.status) !== -1;
            return inTab && matchesQuery(m, opts.query, todayKey);
        });
        if (tab === 'recent' || tab === 'missed') {
            list.sort(function (a, b) {
                return compareMeetings(b, a);
            });
        } else if (tab === 'all') {
            list.sort(function (a, b) {
                var da = Math.abs(dayDiff(a.date, todayKey)), db = Math.abs(dayDiff(b.date, todayKey));
                return da === db ? a.start.localeCompare(b.start) : da - db;
            });
        } else {
            // Upcoming: meetings that are live right now come first, then by date/time.
            list.sort(function (a, b) {
                var la = a.status === 'live' ? 0 : 1, lb = b.status === 'live' ? 0 : 1;
                return la === lb ? compareMeetings(a, b) : la - lb;
            });
        }
        return list;
    }

    /* ---- Join input ------------------------------------------------------- */
    function formatCode(letters) {
        return letters.slice(0, 3) + '-' + letters.slice(3, 7) + '-' + letters.slice(7, 10);
    }

    /**
     * Accepts "abc-defg-hij", "abcdefghij", "ABC DEFG HIJ" or an invite link
     * (https://host/meet/abc-defg-hij, host/join?code=abc-defg-hij).
     * Returns { code } or { error }.
     */
    function parseMeetingInput(raw) {
        var value = String(raw || '').trim();
        if (!value) return {error: 'Enter a meeting code or paste an invite link.'};

        var candidate = value;
        var isLink = /[\/.:?]/.test(value);
        if (isLink) {
            try {
                var url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value);
                candidate = url.searchParams.get('code') || url.pathname.split('/').filter(Boolean).pop() || '';
            } catch (e) {
                return {error: "That link doesn't look valid. Paste the full invite link and try again."};
            }
        }
        try {
            candidate = decodeURIComponent(candidate);
        } catch (e) { /* keep raw */
        }

        var compact = candidate.toLowerCase().replace(/[\s-]/g, '');
        if (!/^[a-z]{10}$/.test(compact)) {
            return {
                error: isLink
                    ? "That link doesn't contain a valid meeting code."
                    : "That doesn't look like a meeting code. Codes look like abc-defg-hij."
            };
        }
        return {code: formatCode(compact)};
    }

    function generateMeetingCode() {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        var bytes = new Uint8Array(10);
        var c = typeof crypto !== 'undefined' ? crypto : null;
        if (c && c.getRandomValues) {
            c.getRandomValues(bytes);
        } else {
            for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
        }
        var s = '';
        for (var j = 0; j < bytes.length; j++) s += letters[bytes[j] % 26];
        return formatCode(s);
    }

    /* ---- Misc ------------------------------------------------------------- */
    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function initialsColorIndex(initials) {
        var sum = 0, s = String(initials);
        for (var i = 0; i < s.length; i++) sum += s.charCodeAt(i);
        return sum % 4;
    }

    function debounce(fn, wait) {
        var t;
        return function () {
            var args = arguments, ctx = this;
            clearTimeout(t);
            t = setTimeout(function () {
                fn.apply(ctx, args);
            }, wait);
        };
    }

    return {
        DAYS_LONG: DAYS_LONG, DAYS_SHORT: DAYS_SHORT, MONTHS_LONG: MONTHS_LONG, MONTHS_SHORT: MONTHS_SHORT,
        STATUS_META: STATUS_META, TAB_STATUSES: TAB_STATUSES,
        pad: pad, toKey: toKey, fromKey: fromKey, dayDiff: dayDiff, addMonths: addMonths,
        formatLongDate: formatLongDate, formatShortDate: formatShortDate, formatDayLabel: formatDayLabel,
        formatTime12: formatTime12, addMinutes: addMinutes, formatDuration: formatDuration, formatRange: formatRange,
        getGreeting: getGreeting, buildMonthGrid: buildMonthGrid,
        isJoinable: isJoinable, filterMeetings: filterMeetings, compareMeetings: compareMeetings,
        parseMeetingInput: parseMeetingInput, generateMeetingCode: generateMeetingCode,
        escapeHtml: escapeHtml, initialsColorIndex: initialsColorIndex, debounce: debounce
    };
});

/* ======================================================================
   Section: dashboard.js
   ====================================================================== */
/**
 * Euodoo Meet dashboard - application script.
 * Depends on (load order): gsap, lucide, dashboard.config.js,
 * dashboard.demo-data.js (demo only), meet-utils.js.
 */
(function () {
    'use strict';

    const U = window.MeetUtils;
    const Cfg = window.EuodooConfig || {};
    const Demo = window.EuodooDemoData || null;
    const routes = Cfg.routes || {};

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const esc = U.escapeHtml;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canAnimate = () => !!window.gsap && !reduceMotion.matches;

    const TONES = ['orange', 'teal', 'purple', 'gray'];
    const TAB_LABELS = {upcoming: 'Upcoming', recent: 'Recent', missed: 'Missed'};

    /* ======================================================================
       State
       ====================================================================== */
    const state = {
        user: (window.EuodooApp && window.EuodooApp.getSession && window.EuodooApp.getSession()) || Cfg.user || (Demo && Demo.user) || {name: 'Kiran S', firstName: 'Kiran', initials: 'KS', role: 'User'},
        meetings: [],
        status: 'loading',            // loading | ready | error
        error: '',
        tab: 'upcoming',
        query: '',
        today: null,                  // Date (midnight)
        todayKey: '',
        selected: null,               // Date
        viewMonth: {year: 0, month: 0},
        notifications: [],
        highlightId: null
    };

    const els = {};

    /* ======================================================================
       Small helpers
       ====================================================================== */
    function getToday() {
        const base = Cfg.referenceDate ? U.fromKey(Cfg.referenceDate) : new Date();
        return new Date(base.getFullYear(), base.getMonth(), base.getDate());
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({attrs: {'stroke-width': 1.75, 'aria-hidden': 'true'}});
        }
    }

    function findMeeting(id) {
        return state.meetings.find((m) => m.id === String(id));
    }

    function meetingsOn(key) {
        return state.meetings.filter((m) => m.date === key).sort(U.compareMeetings);
    }

    function meetingCounts() {
        const counts = {};
        state.meetings.forEach((m) => {
            counts[m.date] = (counts[m.date] || 0) + 1;
        });
        return counts;
    }

    function normalizeMeeting(raw) {
        const all = Array.isArray(raw.participants) ? raw.participants.map(String) : [];
        const status = ['live', 'upcoming', 'ended', 'missed'].includes(raw.status) ? raw.status : 'upcoming';
        return {
            id: String(raw.id),
            title: String(raw.title || 'Untitled meeting'),
            date: String(raw.date),
            start: String(raw.start || '09:00'),
            durationMin: Number(raw.durationMin) || 30,
            team: String(raw.team || ''),
            status,
            participants: all.slice(0, 3),
            extra: raw.extra != null ? Math.max(0, Number(raw.extra) || 0) : Math.max(0, all.length - 3),
            code: String(raw.code || ''),
            tone: TONES.includes(raw.tone) ? raw.tone : 'teal',
            icon: String(raw.icon || 'video').replace(/[^a-z0-9-]/gi, ''),
            recurrence: ['none', 'daily', 'weekly', 'monthly'].includes(raw.recurrence) ? raw.recurrence : 'none',
            repeatUntil: String(raw.repeatUntil || '')
        };
    }

    function csrf() {
        const token = $('meta[name="_csrf"]')?.content;
        const header = $('meta[name="_csrf_header"]')?.content || 'X-CSRF-TOKEN';
        return token ? {token, header} : null;
    }

    /* ======================================================================
       API layer (Spring Boot ready)
       ====================================================================== */
    class ApiError extends Error {
        constructor(message, status) {
            super(message);
            this.status = status;
        }
    }

    async function apiRequest(url, options = {}) {
        const method = (options.method || 'GET').toUpperCase();
        const headers = {Accept: 'application/json', ...(options.headers || {})};
        if (method !== 'GET') {
            headers['Content-Type'] = 'application/json';
            const t = csrf();
            if (t) headers[t.header] = t.token;
        }
        let res;
        try {
            res = await fetch(url, {credentials: 'same-origin', ...options, method, headers});
        } catch (e) {
            throw new ApiError('network', 0);
        }
        if (res.status === 401) {
            window.location.assign(routes.login || '/login');
            throw new ApiError('unauthorized', 401);
        }
        if (!res.ok) throw new ApiError('http-' + res.status, res.status);
        if (res.status === 204) return null;
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    }

    function describeError(err) {
        if (err && err.status === 403) return "You don't have permission to view these meetings.";
        if (err && err.status >= 500) return 'The server ran into a problem loading your meetings.';
        if (err && err.status === 0) return "We couldn't reach the server. Check your connection and try again.";
        return 'Something went wrong while loading your meetings.';
    }

    const MeetingService = {
        async list() {
            if (Cfg.demoMode) {
                await wait(500);
                const flag = new URLSearchParams(window.location.search).get('demoState');
                if (flag === 'error') throw new ApiError('demo-error', 500);
                if (flag === 'empty') return [];
                return JSON.parse(JSON.stringify((Demo && Demo.meetings) || []));
            }
            const data = await apiRequest(Cfg.api.meetings);
            return Array.isArray(data) ? data : (data && data.meetings) || [];
        },

        async create(payload) {
            if (Cfg.demoMode) {
                await wait(400);
                const created = {
                    id: 'local-' + Date.now(), code: U.generateMeetingCode(), title: payload.title,
                    date: payload.date, start: payload.start, durationMin: payload.durationMin, team: payload.team,
                    status: payload.instant ? 'live' : 'upcoming', participants: [state.user.initials], extra: 0,
                    tone: payload.instant ? 'orange' : 'teal', icon: 'video',
                    recurrence: ['none', 'daily', 'weekly', 'monthly'].includes(payload.recurrence) ? payload.recurrence : 'none',
                    repeatUntil: payload.repeatUntil || ''
                };
                // Store the creator as the demo host for this meeting ID (shared, localStorage)
                if (window.EuodooApp) {
                    EuodooApp.registerDemoMeeting(created.code, created.title, state.user);
                }
                return created;
            }
            return apiRequest(Cfg.api.createMeeting, {method: 'POST', body: JSON.stringify(payload)});
        },

        async notifications() {
            if (Cfg.demoMode) return JSON.parse(JSON.stringify((Demo && Demo.notifications) || []));
            if (!Cfg.api.notifications) return [];
            const data = await apiRequest(Cfg.api.notifications);
            return Array.isArray(data) ? data : [];
        }
    };

    /* ======================================================================
       Motion helpers (all no-ops without GSAP or with reduced motion)
       ====================================================================== */
    function playEntrance() {
        const root = document.documentElement;
        const targets = $$('[data-animate]');
        if (!canAnimate()) {
            root.classList.remove('anim-pending');
            return;
        }
        window.gsap.fromTo(targets, {opacity: 0, y: 14},
            {opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07, clearProps: 'opacity,transform'});
        root.classList.remove('anim-pending');
    }

    function animateRows() {
        if (!canAnimate()) return;
        const rows = $$('.meeting-row', els.list);
        if (!rows.length) return;
        window.gsap.fromTo(rows, {opacity: 0, y: 10},
            {opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.045, clearProps: 'opacity,transform'});
    }

    function pulse(el) {
        if (!canAnimate() || !el) return;
        window.gsap.fromTo(el, {scale: 0.94}, {scale: 1, duration: 0.35, ease: 'back.out(3)', clearProps: 'transform'});
    }

    function shake(el) {
        if (!canAnimate() || !el) return;
        window.gsap.fromTo(el, {x: -7}, {x: 0, duration: 0.45, ease: 'elastic.out(1, 0.35)', clearProps: 'transform'});
    }

    function flashRow(id) {
        if (!canAnimate()) return;
        const row = $(`.meeting-row[data-id="${CSS.escape(String(id))}"]`, els.list);
        if (row) window.gsap.fromTo(row, {backgroundColor: '#DFF3F0'}, {
            backgroundColor: 'rgba(223,243,240,0)',
            duration: 1.2,
            ease: 'power1.out',
            clearProps: 'backgroundColor'
        });
    }

    function moveThumb(animate) {
        const active = $('[role="tab"][aria-selected="true"]', els.tabs);
        if (!active || !els.thumb || !active.offsetWidth) return;
        const x = active.offsetLeft, width = active.offsetWidth;
        if (window.gsap) {
            if (animate && canAnimate()) window.gsap.to(els.thumb, {x, width, duration: 0.28, ease: 'power3.out'});
            else window.gsap.set(els.thumb, {x, width});
        } else {
            els.thumb.style.transform = `translateX(${x}px)`;
            els.thumb.style.width = width + 'px';
        }
    }

    /* ======================================================================
       Toasts
       ====================================================================== */
    function toast(message, {type = 'info', duration = 3800} = {}) {
        // Delegates to the shared EuodooToast component (js/toast.js), which is
        // the single toast implementation used across all Euodoo Meet pages.
        if (window.EuodooToast) return EuodooToast.toast(message, {type: type === 'success' ? 'success' : type, duration});
        const region = els.toasts; // very late-load fallback
        if (!region) return;
        while (region.children.length >= 3) region.firstElementChild.remove();
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.setAttribute('role', type === 'error' ? 'alert' : 'status');
        el.innerHTML = `<i data-lucide="info" class="h-5 w-5"></i><p>${esc(message)}</p>`;
        region.appendChild(el);
        refreshIcons();
        setTimeout(() => {
            el.classList.add('is-leaving');
            setTimeout(() => el.remove(), 220);
        }, duration);
    }

    function navigateTo(url, message) {
        if (message) toast(message, {type: 'success'});
        setTimeout(() => {
            window.location.assign(url);
        }, 300);
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try {
                ok = document.execCommand('copy');
            } catch (err) {
                ok = false;
            }
            ta.remove();
            return ok;
        }
    }

    function inviteUrl(code) {
        return new URL(routes.meetingRoom(code), window.location.href).href;
    }

    /** Full invitation text (Phase 2): everything a teammate needs in a calendar note. */
    function buildInvitationText(m) {
        const base = m.date ? U.fromKey(m.date) : new Date();
        const startStr = m.start ? m.start : '09:00';
        const dayTxt = base.toLocaleDateString(undefined, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
        const rangeTxt = U.formatRange(startStr, m.durationMin || 30);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time';
        const repeatBits = {
            daily: 'This meeting repeats daily',
            weekly: 'This meeting repeats every week at the same time',
            monthly: `This meeting repeats monthly (day ${base.getDate()})`
        }[m.recurrence || 'none'];
        const repeatLine = repeatBits ? (repeatBits + (m.repeatUntil ? ` until ${U.fromKey(m.repeatUntil).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})}.` : '.')) : '';
        return [
            `You're invited: ${m.title || 'Euodoo Meet'}`,
            m.team ? `Team: ${m.team}` : '',
            `${dayTxt} at ${rangeTxt} (${tz})`,
            repeatLine,
            `Join link: ${inviteUrl(m.code)}`,
            `Meeting ID: ${m.code || ''}`,
            '— Sent from Euodoo Meet'
        ].filter(Boolean).join('\n');
    }

    async function copyInviteText() {
        const m = createdMeeting;
        if (!m || !m.code) {
            toast('Create the meeting first to invite people.', {type: 'error'});
            return;
        }
        const ok = await copyText(buildInvitationText(m));
        toast(ok ? 'Invitation text copied — paste it in an email or chat.' : "Couldn't copy automatically.",
            {type: ok ? 'success' : 'error'});
    }

    async function copyInvite(code) {
        if (!code) {
            toast('This meeting has no invite link yet.', {type: 'error'});
            return;
        }
        const ok = await copyText(inviteUrl(code));
        toast(ok ? 'Invite link copied to clipboard.' : "Couldn't copy automatically. Copy the code instead: " + code,
            {type: ok ? 'success' : 'error'});
    }

    /* ======================================================================
       Dialog helpers
       ====================================================================== */
    function openDialog(dlg) {
        closeAllPopovers();
        if (!dlg || dlg.open) return;
        dlg.showModal();
        const panel = $('.dialog-panel', dlg);
        if (canAnimate() && panel) {
            window.gsap.fromTo(panel, {opacity: 0, y: 16, scale: 0.98},
                {opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out', clearProps: 'opacity,transform'});
        }
    }

    function closeDialog(dlg) {
        if (!dlg || !dlg.open) return;
        const panel = $('.dialog-panel', dlg);
        if (!canAnimate() || !panel) {
            dlg.close();
            return;
        }
        window.gsap.to(panel, {
            opacity: 0, y: 8, duration: 0.15, ease: 'power1.in',
            onComplete: () => {
                dlg.close();
                window.gsap.set(panel, {clearProps: 'opacity,transform'});
            }
        });
    }

    /* ======================================================================
       Rendering - header, greeting, user
       ====================================================================== */
    function renderUser() {
        $$('[data-user-initials]').forEach((n) => {
            n.textContent = state.user.initials;
        });
        $$('[data-user-name]').forEach((n) => {
            n.textContent = state.user.name;
        });
        $$('[data-user-role]').forEach((n) => {
            n.textContent = state.user.role;
        });
    }

    function renderDate() {
        $('#date-long').textContent = U.formatLongDate(state.today);
        $('#date-short').textContent = U.formatShortDate(state.today);
        els.dateBtn.setAttribute('aria-label', `Go to today, ${U.formatLongDate(state.today)}`);
    }

    function renderGreeting() {
        els.greeting.textContent = `Good ${U.getGreeting(new Date().getHours()).toLowerCase()}, ${state.user.firstName}`;
        if (state.status !== 'ready') return;
        const n = meetingsOn(state.todayKey).filter((m) => m.status !== 'missed').length;
        els.greetingSub.textContent = n === 0
            ? 'No meetings today. Enjoy the focus time.'
            : `You have ${n} meeting${n === 1 ? '' : 's'} today. Ready to jump in?`;
    }

    /* ======================================================================
       Rendering - Calls list
       ====================================================================== */
    function avatarsHtml(m) {
        const items = m.participants.map((p) => `<span class="avatar avatar-c${U.initialsColorIndex(p)}">${esc(p)}</span>`);
        if (m.extra) items.push(`<span class="avatar avatar-more">+${m.extra}</span>`);
        return items.join('');
    }

    function peopleLabel(m) {
        return `Participants: ${m.participants.join(', ')}${m.extra ? ` and ${m.extra} more` : ''}`;
    }

    function badgeHtml(m) {
        const meta = U.STATUS_META[m.status];
        return `<span class="badge badge-${m.status}">${m.status === 'live' ? '<span class="dot" aria-hidden="true"></span>' : ''}${esc(meta.label)}</span>`;
    }

    function rowHtml(m) {
        const joinable = U.isJoinable(m, state.todayKey);
        const sub = [U.formatDayLabel(m.date, state.todayKey), m.team].filter(Boolean).join(' . ');
        const action = joinable
            ? `<button type="button" class="btn btn-orange btn-sm" data-action="join" data-id="${esc(m.id)}" aria-label="Join ${esc(m.title)}">Join</button>`
            : `<button type="button" class="btn btn-outline btn-sm" data-action="details" data-id="${esc(m.id)}" aria-label="Details for ${esc(m.title)}">Details</button>`;
        return `
      <article class="meeting-row${m.status === 'live' ? ' is-live' : ''}" data-id="${esc(m.id)}">
        <div class="row-icon tone-${m.tone}" aria-hidden="true"><i data-lucide="${esc(m.icon)}" class="h-5 w-5"></i></div>
        <div class="row-main">
          <button type="button" class="row-title" data-action="details" data-id="${esc(m.id)}">${esc(m.title)}</button>
          <p class="row-sub">${esc(sub)}</p>
        </div>
        <div class="row-people" role="img" aria-label="${esc(peopleLabel(m))}">${avatarsHtml(m)}</div>
        <div class="row-time"><p class="t">${esc(U.formatTime12(m.start))}</p><p class="dur">${esc(U.formatDuration(m.durationMin))}</p></div>
        <div class="row-status">${badgeHtml(m)}</div>
        <div class="row-action">${action}</div>
      </article>`;
    }

    function skeletonHtml() {
        const bar = (w, h = 12) => `<span class="block animate-pulse rounded-md bg-[#E4ECEE]" style="width:${w};height:${h}px"></span>`;
        return Array.from({length: 4}, () => `
      <div class="skeleton-row" aria-hidden="true">
        <span class="block h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#E4ECEE]"></span>
        <div class="min-w-0 flex-1 space-y-2">${bar('42%', 14)}${bar('28%')}</div>
        ${bar('64px', 28)}
      </div>`).join('') + '<p class="sr-only">Loading meetings�|</p>';
    }

    function stateBlock(icon, title, text, buttonHtml = '') {
        return `
      <div class="grid place-items-center px-4 py-12 text-center">
        <span class="grid h-14 w-14 place-items-center rounded-2xl bg-canvas text-teal"><i data-lucide="${icon}" class="h-7 w-7"></i></span>
        <h3 class="mt-4 text-base font-bold">${esc(title)}</h3>
        <p class="mt-1 max-w-[36ch] text-[13.5px] leading-5 text-muted-strong">${text}</p>
        ${buttonHtml ? `<div class="mt-5 flex flex-wrap justify-center gap-2">${buttonHtml}</div>` : ''}
      </div>`;
    }

    function emptyHtml() {
        if (state.query) {
            return stateBlock('search', 'No meetings found',
                `Nothing in ${esc(TAB_LABELS[state.tab])} matches "${esc(state.query)}". Try another tab or a different search.`,
                '<button type="button" class="btn btn-outline btn-sm" data-action="clear-search">Clear search</button>');
        }
        const copy = {
            upcoming: ['calendar', "You're all clear", 'No upcoming meetings. Start one now or join with a code.',
                '<button type="button" class="btn btn-orange btn-sm" data-action="open-create" data-mode="instant">New meeting</button>'],
            recent: ['inbox', 'No recent meetings', "Meetings you've attended will show up here.", ''],
            missed: ['circle-check', 'Nothing missed', "You haven't missed any meetings. Nice work.", '']
        }[state.tab];
        return stateBlock(copy[0], copy[1], copy[2], copy[3]);
    }

    function renderList({animate = false} = {}) {
        const list = els.list;
        list.setAttribute('aria-busy', state.status === 'loading' ? 'true' : 'false');
        list.setAttribute('aria-labelledby', 'tab-' + state.tab);

        if (state.status === 'loading') {
            list.innerHTML = skeletonHtml();
            return;
        }
        if (state.status === 'error') {
            list.innerHTML = stateBlock('triangle-alert', "Couldn't load meetings", esc(state.error),
                '<button type="button" class="btn btn-teal btn-sm" data-action="retry"><i data-lucide="refresh-cw" class="h-4 w-4"></i>Try again</button>');
            refreshIcons();
            return;
        }

        const items = U.filterMeetings(state.meetings, {tab: state.tab, query: state.query}, state.todayKey);
        list.innerHTML = items.length ? items.map(rowHtml).join('') : emptyHtml();
        refreshIcons();
        if (items.length && animate) animateRows();
        if (state.highlightId) {
            flashRow(state.highlightId);
            state.highlightId = null;
        }
    }

    /* ======================================================================
       Rendering - calendar & schedule
       ====================================================================== */
    function renderCalendar({direction = 0} = {}) {
        const {year, month} = state.viewMonth;
        const selectedKey = U.toKey(state.selected);
        const grid = U.buildMonthGrid(year, month, {todayKey: state.todayKey, selectedKey, counts: meetingCounts()});

        const selectedVisible = grid.cells.some((c) => c.isSelected && c.inMonth);
        const focusKey = selectedVisible ? selectedKey : grid.cells.find((c) => c.inMonth).key;

        els.calTitle.textContent = grid.label;
        els.calGrid.setAttribute('aria-label', grid.label);
        els.calGrid.innerHTML = grid.cells.map((c) => {
            const cls = ['cal-cell'];
            if (!c.inMonth) cls.push('is-muted');
            if (c.isToday) cls.push('is-today');
            if (c.isSelected) cls.push('is-selected');
            if (c.count) cls.push('has-meetings');
            const label = `${U.formatLongDate(c.date)}${c.count ? `, ${c.count} meeting${c.count > 1 ? 's' : ''}` : ''}${c.isToday ? ', today' : ''}`;
            return `<button type="button" class="${cls.join(' ')}" data-key="${c.key}" tabindex="${c.key === focusKey ? 0 : -1}"
                aria-pressed="${c.isSelected}" aria-label="${esc(label)}"${c.isToday ? ' aria-current="date"' : ''}>
                <span>${c.day}</span><span class="cal-dot" aria-hidden="true"></span></button>`;
        }).join('');

        els.calSub.textContent = selectedKey === state.todayKey
            ? `Today is ${U.DAYS_LONG[state.today.getDay()]}, ${state.today.getDate()}`
            : `Selected: ${U.formatShortDate(state.selected)}`;

        if (direction && canAnimate()) {
            window.gsap.fromTo(els.calGrid, {opacity: 0, x: direction * 12},
                {opacity: 1, x: 0, duration: 0.22, ease: 'power2.out', clearProps: 'opacity,transform'});
        }
    }

    function renderSchedule() {
        const key = U.toKey(state.selected);
        const isToday = key === state.todayKey;
        els.schTitle.textContent = isToday ? "Today's schedule" : `Schedule . ${U.formatShortDate(state.selected)}`;

        if (state.status === 'loading') {
            els.schCount.textContent = '';
            els.schList.innerHTML = Array.from({length: 3}, () =>
                '<li aria-hidden="true" class="flex items-center gap-3"><span class="h-10 w-[3px] rounded-full bg-[#E4ECEE]"></span><span class="block h-9 flex-1 animate-pulse rounded-lg bg-[#E4ECEE]"></span></li>').join('');
            return;
        }

        const items = meetingsOn(key);
        els.schCount.textContent = items.length ? `${items.length} meeting${items.length === 1 ? '' : 's'}` : 'No meetings';

        if (!items.length) {
            els.schList.innerHTML = `
        <li class="grid place-items-center rounded-2xl bg-canvas px-4 py-8 text-center">
          <i data-lucide="calendar" class="h-6 w-6 text-muted"></i>
          <p class="mt-2 text-[14px] font-semibold">Nothing scheduled</p>
          <p class="mt-0.5 text-[13px] text-muted-strong">${isToday ? 'Your day is free.' : 'Enjoy the free day.'}</p>
          <button type="button" class="btn btn-outline btn-sm mt-4" data-action="open-create" data-mode="schedule">Schedule a meeting</button>
        </li>`;
            refreshIcons();
            return;
        }

        els.schList.innerHTML = items.map((m) => {
            const joinable = U.isJoinable(m, state.todayKey);
            return `
        <li class="schedule-item tone-${m.tone === 'gray' ? 'gray' : m.tone}">
          <span class="schedule-bar" aria-hidden="true"></span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[15px] font-semibold leading-5">${esc(m.title)}</p>
            <p class="mt-0.5 text-[13px] text-muted-strong">${esc(U.formatRange(m.start, m.durationMin))}</p>
          </div>
          <button type="button" class="schedule-btn" data-action="${joinable ? 'join' : 'details'}" data-id="${esc(m.id)}"
                  aria-label="${joinable ? 'Join' : 'View details for'} ${esc(m.title)}"><i data-lucide="video" class="h-[18px] w-[18px]"></i></button>
        </li>`;
        }).join('');
        refreshIcons();
    }

    function renderAll() {
        renderGreeting();
        renderList();
        renderCalendar();
        renderSchedule();
    }

    /* ======================================================================
       Data loading
       ====================================================================== */
    let loadSeq = 0;

    async function loadMeetings({silent = false, animate = true} = {}) {
        const seq = ++loadSeq;
        if (!silent) {
            state.status = 'loading';
            renderList();
            renderSchedule();
        }
        try {
            const raw = await MeetingService.list();
            if (seq !== loadSeq) return;
            state.meetings = raw.map(normalizeMeeting);
            state.status = 'ready';
            state.error = '';
        } catch (err) {
            if (seq !== loadSeq) return;
            state.status = 'error';
            state.error = describeError(err);
        }
        renderAll();
        if (state.status === 'ready' && animate) animateRows();
    }

    /* ======================================================================
       Calls tabs
       ====================================================================== */
    function setTab(tab, {focus = false} = {}) {
        if (!TAB_LABELS[tab]) return;
        state.tab = tab;
        $$('[role="tab"]', els.tabs).forEach((btn) => {
            const on = btn.dataset.tab === tab;
            btn.setAttribute('aria-selected', String(on));
            btn.tabIndex = on ? 0 : -1;
            if (on && focus) btn.focus();
        });
        moveThumb(true);
        renderList({animate: true});
    }

    function onTabKeydown(e) {
        const order = Object.keys(TAB_LABELS);
        const i = order.indexOf(state.tab);
        let next = null;
        if (e.key === 'ArrowRight') next = order[(i + 1) % order.length];
        else if (e.key === 'ArrowLeft') next = order[(i - 1 + order.length) % order.length];
        else if (e.key === 'Home') next = order[0];
        else if (e.key === 'End') next = order[order.length - 1];
        if (next) {
            e.preventDefault();
            setTab(next, {focus: true});
        }
    }

    /* ======================================================================
       Calendar interactions
       ====================================================================== */
    function selectDate(date, {focus = false} = {}) {
        state.selected = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        state.viewMonth = {year: state.selected.getFullYear(), month: state.selected.getMonth()};
        renderCalendar();
        renderSchedule();
        if (focus) $(`.cal-cell[data-key="${U.toKey(state.selected)}"]`, els.calGrid)?.focus();
    }

    function shiftMonth(n) {
        const d = U.addMonths(new Date(state.viewMonth.year, state.viewMonth.month, 1), n);
        state.viewMonth = {year: d.getFullYear(), month: d.getMonth()};
        renderCalendar({direction: n});
    }

    function onCalendarKeydown(e) {
        const cell = e.target.closest('.cal-cell');
        if (!cell) return;
        const d = U.fromKey(cell.dataset.key);
        const step = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7}[e.key];
        if (step) {
            d.setDate(d.getDate() + step);
        } else if (e.key === 'PageUp') {
            const m = U.addMonths(d, -1);
            d.setTime(m.getTime());
        } else if (e.key === 'PageDown') {
            const m = U.addMonths(d, 1);
            d.setTime(m.getTime());
        } else return;
        e.preventDefault();
        selectDate(d, {focus: true});
    }

    function goToToday() {
        selectDate(state.today);
        toast(`Showing today, ${U.formatShortDate(state.today)}.`);
    }

    /* ======================================================================
       Join & details
       ====================================================================== */
    function joinMeeting(m, trigger) {
        if (!m) return;
        pulse(trigger);
        if (!m.code) {
            toast("This meeting doesn't have a join link yet.", {type: 'error'});
            return;
        }
        // Host goes straight into the call page; participants go to the waiting room.
        const demoRecord = window.EuodooApp && EuodooApp.getDemoMeeting ? EuodooApp.getDemoMeeting(m.code) : null;
        if (!demoRecord && window.EuodooApp && EuodooApp.registerDemoMeeting) {
            // Self-heal a lost/cleared registry entry (e.g. stale cache or cleared
            // storage) so the creator still enters as the host. registerDemoMeeting
            // never overwrites a record that already has a host.
            EuodooApp.registerDemoMeeting(m.code, m.title, state.user);
        }
        const isHost = !!(window.EuodooApp && EuodooApp.isHostForMeeting(m.code));
        if (demoRecord && demoRecord.endedAt && !isHost) {
            toast('That meeting has ended.', {type: 'error'});
            return;
        }
        if (window.EuodooApp) {
            EuodooApp.setMeeting({
                id: m.id || m.code,
                code: m.code,
                title: m.title || 'Meeting',
                isHost: isHost
            });
        }
        if (isHost) {
            navigateTo('Callpage.html?meetingId=' + encodeURIComponent(m.code) +
                '&meetingTitle=' + encodeURIComponent(m.title || ''), `Opening "${m.title}" as host...`);
        } else {
            navigateTo(routes.meetingRoom(m.code, m.title), `Joining "${m.title}"...`);
        }
    }

    function setJoinError(message) {
        const input = els.joinInput;
        els.joinError.hidden = !message;
        els.joinError.textContent = message || '';
        if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }

    function onJoinSubmit(e) {
        e.preventDefault();
        const result = U.parseMeetingInput(els.joinInput.value);
        if (result.error) {
            setJoinError(result.error);
            shake(els.joinField);
            els.joinInput.focus();
            return;
        }
        setJoinError('');
        const known = state.meetings.find((m) => m.code === result.code);
        const demoRecord = window.EuodooApp && EuodooApp.getDemoMeeting ? EuodooApp.getDemoMeeting(result.code) : null;
        const meetingTitle = (known && known.title) || (demoRecord && demoRecord.title) || ('Meeting ' + result.code);
        pulse(els.joinBtn);
        // Demo role check: only the stored host of this meeting enters directly.
        const isHost = !!(window.EuodooApp && EuodooApp.isHostForMeeting(result.code));
        if (demoRecord && demoRecord.endedAt && !isHost) {
            setJoinError('That meeting has ended. Ask the host for a new meeting code.');
            els.joinInput.focus();
            return;
        }
        if (!known && !demoRecord) {
            setJoinError("We couldn't find a meeting with that code. Check the code and try again.");
            els.joinInput.focus();
            return;
        }
        if (!demoRecord && window.EuodooApp && EuodooApp.registerDemoMeeting) {
            // Self-heal a lost/cleared registry entry so joining keeps working.
            EuodooApp.registerDemoMeeting(result.code, meetingTitle, state.user);
        }
        if (window.EuodooApp) {
            EuodooApp.setMeeting({
                id: result.code,
                code: result.code,
                title: meetingTitle,
                isHost: isHost
            });
        }
        if (isHost) {
            navigateTo('Callpage.html?meetingId=' + encodeURIComponent(result.code) +
                '&meetingTitle=' + encodeURIComponent(meetingTitle), `Opening ${meetingTitle} as host...`);
        } else {
            navigateTo(routes.meetingRoom(result.code, meetingTitle), `Joining ${meetingTitle}...`);
        }
        els.joinInput.value = '';
    }

    function openDetails(id) {
        const m = findMeeting(id);
        if (!m) return;
        closeSearch();
        const joinable = U.isJoinable(m, state.todayKey);
        const people = m.participants.map((p) => `<span class="avatar avatar-lg avatar-c${U.initialsColorIndex(p)}">${esc(p)}</span>`).join('')
            + (m.extra ? `<span class="avatar avatar-lg avatar-more">+${m.extra}</span>` : '');
        els.detailsBody.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <span class="row-icon tone-${m.tone} shrink-0" aria-hidden="true"><i data-lucide="${esc(m.icon)}" class="h-5 w-5"></i></span>
          <div class="min-w-0">
            <h2 id="details-title" class="text-xl font-bold leading-7 [overflow-wrap:anywhere]">${esc(m.title)}</h2>
            <div class="mt-1">${badgeHtml(m)}</div>
          </div>
        </div>
        <button type="button" class="icon-btn -mr-2 -mt-1" data-close aria-label="Close dialog"><i data-lucide="x" class="h-5 w-5"></i></button>
      </div>

      <dl class="detail-grid mt-6">
        <div><dt class="detail-label">Date</dt><dd class="detail-value">${esc(U.formatDayLabel(m.date, state.todayKey))} . ${esc(U.formatLongDate(U.fromKey(m.date)))}</dd></div>
        <div><dt class="detail-label">Time</dt><dd class="detail-value">${esc(U.formatRange(m.start, m.durationMin))}</dd></div>
        <div><dt class="detail-label">Duration</dt><dd class="detail-value">${esc(U.formatDuration(m.durationMin))}</dd></div>
        <div><dt class="detail-label">Team</dt><dd class="detail-value">${esc(m.team || 'Not set')}</dd></div>
        <div class="sm:col-span-2"><dt class="detail-label">Meeting code</dt><dd class="detail-value font-mono tracking-wide">${esc(m.code || 'Not available')}</dd></div>
      </dl>

      <div class="mt-5">
        <p class="detail-label">Participants</p>
        <div class="mt-2 flex items-center gap-2" role="img" aria-label="${esc(peopleLabel(m))}">${people}</div>
      </div>

      <div class="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" class="btn btn-outline" data-close>Close</button>
        <button type="button" class="btn btn-outline" data-action="copy-link" data-code="${esc(m.code)}"><i data-lucide="copy" class="h-4 w-4"></i>Copy invite link</button>
        ${joinable ? `<button type="button" class="btn btn-orange" data-action="join" data-id="${esc(m.id)}" data-close-dialog><i data-lucide="video" class="h-4 w-4"></i>Join meeting</button>` : ''}
      </div>`;
        refreshIcons();
        openDialog(els.detailsDlg);
    }

    /* ======================================================================
       Create meeting dialog
       ====================================================================== */
    let createMode = 'instant';
    let createdMeeting = null;

    function setCreateMode(mode, {focus = false} = {}) {
        createMode = mode;
        $$('[role="tab"]', els.createModes).forEach((btn) => {
            const on = btn.dataset.mode === mode;
            btn.setAttribute('aria-selected', String(on));
            btn.tabIndex = on ? 0 : -1;
            if (on && focus) btn.focus();
        });
        els.instantForm.hidden = mode !== 'instant';
        els.scheduleForm.hidden = mode !== 'schedule';
    }

    function clearFieldErrors() {
        $$('.field-error', els.createDlg).forEach((p) => {
            p.hidden = true;
            p.textContent = '';
        });
        $$('.field[aria-invalid]', els.createDlg).forEach((f) => f.removeAttribute('aria-invalid'));
    }

    function setFieldError(inputId, errorId, message) {
        const input = $('#' + inputId), p = $('#' + errorId);
        if (message) {
            p.textContent = message;
            p.hidden = false;
            input.setAttribute('aria-invalid', 'true');
        } else {
            p.hidden = true;
            p.textContent = '';
            input.removeAttribute('aria-invalid');
        }
    }

    function resetCreateDialog() {
        createdMeeting = null;
        els.createBody.hidden = false;
        els.createSuccess.hidden = true;
        els.instantForm.reset();
        els.scheduleForm.reset();
        clearFieldErrors();
        const now = new Date();
        $('#sch-date').value = U.toKey(state.selected);
        $('#sch-date').min = state.todayKey;
        $('#sch-time').value = U.pad((now.getHours() + 1) % 24) + ':00';
        $('#sch-duration').value = '30';
        // Recurrence resets back to "Does not repeat".
        $('#sch-recurrence').value = 'none';
        $('#sch-repeat-until-wrap').hidden = true;
        $('#sch-repeat-until').value = '';
        $('#sch-repeat-until').min = U.toKey(state.selected);
        $('#sch-recurrence-summary').hidden = true;
        setFieldError('sch-repeat-until', 'sch-recurrence-error', '');
        setBusy(els.instantSubmit, false);
        setBusy(els.scheduleSubmit, false);
    }

    function openCreate(mode = 'instant') {
        resetCreateDialog();
        setCreateMode(mode === 'schedule' ? 'schedule' : 'instant');
        openDialog(els.createDlg);
        setTimeout(() => (mode === 'schedule' ? $('#sch-title') : $('#instant-title'))?.focus(), 30);
    }

    function setBusy(btn, busy) {
        if (!btn) return;
        if (busy) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
        btn.disabled = busy;
    }

    function showCreated(m, whenText) {
        createdMeeting = m;
        els.createBody.hidden = true;
        els.createSuccess.hidden = false;
        $('#created-title').textContent = m.title;
        $('#created-code').textContent = m.code;
        const repeatSuffix = {daily: ' • Repeats daily', weekly: ' • Repeats weekly', monthly: ' • Repeats monthly'}[m.recurrence] || '';
        $('#created-when').textContent = whenText + repeatSuffix;
        $('#create-title').textContent = 'Meeting created';
        pulse($('.rounded-2xl', els.createSuccess));
        refreshIcons();
        els.createdEnter.focus();
    }

    async function afterCreate(created) {
        const meeting = normalizeMeeting(created);
        if (Cfg.demoMode) state.meetings.unshift(meeting);
        else await loadMeetings({silent: true, animate: false});
        state.highlightId = meeting.id;
        state.query = '';
        els.search.value = '';
        if (state.tab !== 'upcoming') setTab('upcoming'); else renderList();
        selectDate(U.fromKey(meeting.date));
        renderGreeting();
        return meeting;
    }

    async function onInstantSubmit(e) {
        e.preventDefault();
        const title = $('#instant-title').value.trim() || 'Instant meeting';
        if (title.length > 80) {
            els.instantError.textContent = 'Keep the title under 80 characters.';
            els.instantError.hidden = false;
            return;
        }
        els.instantError.hidden = true;
        setBusy(els.instantSubmit, true);
        const now = new Date();
        try {
            const created = await MeetingService.create({
                title,
                instant: true,
                date: state.todayKey,
                start: U.pad(now.getHours()) + ':' + U.pad(now.getMinutes()),
                durationMin: 60,
                team: ''
            });
            const meeting = await afterCreate(created);
            showCreated(meeting, 'Started just now . anyone with the link can join');
        } catch (err) {
            els.instantError.textContent = "We couldn't create the meeting. Please try again.";
            els.instantError.hidden = false;
            shake(els.instantSubmit);
        } finally {
            setBusy(els.instantSubmit, false);
        }
    }

    function updateRecurrenceUi() {
        const mode = $('#sch-recurrence').value;
        $('#sch-repeat-until-wrap').hidden = mode === 'none';
        const summary = $('#sch-recurrence-summary');
        if (mode === 'none') {
            summary.hidden = true;
            return;
        }
        const parts = [];
        const dateKey = $('#sch-date').value;
        const base = dateKey ? U.fromKey(dateKey) : new Date();
        if (mode === 'daily') parts.push('Repeats every day');
        else if (mode === 'weekly') parts.push(`Repeats every ${base.toLocaleDateString(undefined, {weekday: 'long'})}`);
        else parts.push(`Repeats monthly on the ${base.getDate()}`);
        const until = $('#sch-repeat-until').value;
        parts.push(until ? `until ${new Date(until + 'T00:00:00').toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})}` : 'until you cancel it');
        summary.textContent = parts.join(', ') + '.';
        summary.hidden = false;
    }

    function validateSchedule(values) {
        const errors = {};
        if (!values.title) errors.title = 'Give your meeting a title.';
        else if (values.title.length > 80) errors.title = 'Keep the title under 80 characters.';
        if (!values.date) errors.date = 'Pick a date.';
        else if (values.date < state.todayKey) errors.date = 'Choose today or a future date.';
        if (!values.start) errors.start = 'Pick a start time.';
        if (values.recurrence !== 'none' && values.repeatUntil) {
            if (values.repeatUntil < values.date) {
                errors.recurrence = '"Repeat until" can\'t be before the meeting date.';
            } else if (values.recurrence === 'monthly' && values.repeatUntil.length === 10) {
                const ym = (d) => d.slice(0, 7);
                if (ym(values.repeatUntil) === ym(values.date)) errors.recurrence = 'A monthly repeat needs an "until" date at least one month later.';
            }
        }
        return errors;
    }

    async function onScheduleSubmit(e) {
        e.preventDefault();
        const values = {
            title: $('#sch-title').value.trim(), date: $('#sch-date').value, start: $('#sch-time').value,
            durationMin: Number($('#sch-duration').value) || 30, team: $('#sch-team').value.trim(),
            recurrence: $('#sch-recurrence').value, repeatUntil: $('#sch-repeat-until').value, instant: false
        };
        const errors = validateSchedule(values);
        setFieldError('sch-title', 'sch-title-error', errors.title);
        setFieldError('sch-date', 'sch-date-error', errors.date);
        setFieldError('sch-time', 'sch-time-error', errors.start);
        setFieldError('sch-repeat-until', 'sch-recurrence-error', errors.recurrence);
        els.scheduleError.hidden = true;
        const firstBad = [{k: 'title', el: '#sch-title'}, {k: 'date', el: '#sch-date'}, {k: 'start', el: '#sch-time'}, {k: 'recurrence', el: '#sch-repeat-until'}].find((x) => errors[x.k]);
        if (firstBad) {
            $(firstBad.el).focus();
            shake(els.scheduleSubmit);
            return;
        }
        setBusy(els.scheduleSubmit, true);
        try {
            const created = await MeetingService.create(values);
            const meeting = await afterCreate(created);
            showCreated(meeting, `${U.formatDayLabel(meeting.date, state.todayKey)} . ${U.formatRange(meeting.start, meeting.durationMin)}`);
            toast(`"${meeting.title}" scheduled.`, {type: 'success'});
        } catch (err) {
            els.scheduleError.textContent = "We couldn't schedule the meeting. Please try again.";
            els.scheduleError.hidden = false;
        } finally {
            setBusy(els.scheduleSubmit, false);
        }
    }

    /* ======================================================================
       Search
       ====================================================================== */
    let searchResults = [];
    let searchActive = -1;

    function renderSearchPanel() {
        const panel = els.searchPanel;
        if (!state.query) {
            closeSearch();
            return;
        }
        searchResults = U.filterMeetings(state.meetings, {tab: 'all', query: state.query}, state.todayKey).slice(0, 6);
        searchActive = -1;
        if (state.status === 'loading') {
            panel.innerHTML = '<p class="px-3 py-4 text-[13.5px] text-muted-strong">Loading meetings�|</p>';
        } else if (!searchResults.length) {
            panel.innerHTML = `<p class="px-3 py-4 text-[13.5px] text-muted-strong">No meetings match "${esc(state.query)}".</p>`;
        } else {
            panel.innerHTML = searchResults.map((m, i) => `
        <button type="button" role="option" id="sr-${i}" aria-selected="false" class="popover-item" data-action="details" data-id="${esc(m.id)}">
          <span class="row-icon tone-${m.tone} !h-9 !w-9 !rounded-lg" aria-hidden="true"><i data-lucide="${esc(m.icon)}" class="h-[18px] w-[18px]"></i></span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[14px] font-semibold">${esc(m.title)}</span>
            <span class="block truncate text-[12.5px] font-normal text-muted-strong">${esc(U.formatDayLabel(m.date, state.todayKey))} . ${esc(m.team || U.formatTime12(m.start))}</span>
          </span>
          ${badgeHtml(m)}
        </button>`).join('');
            refreshIcons();
        }
        panel.hidden = false;
        els.search.setAttribute('aria-expanded', 'true');
    }

    function closeSearch() {
        els.searchPanel.hidden = true;
        els.search.setAttribute('aria-expanded', 'false');
        els.search.removeAttribute('aria-activedescendant');
        searchActive = -1;
    }

    function setSearchActive(i) {
        searchActive = i;
        $$('[role="option"]', els.searchPanel).forEach((o, idx) => o.setAttribute('aria-selected', String(idx === i)));
        if (i >= 0) {
            els.search.setAttribute('aria-activedescendant', 'sr-' + i);
            $('#sr-' + i)?.scrollIntoView({block: 'nearest'});
        } else els.search.removeAttribute('aria-activedescendant');
    }

    const onSearchInput = U.debounce(() => {
        state.query = els.search.value.trim();
        renderList();
        if (state.query) renderSearchPanel(); else closeSearch();
    }, 120);

    function onSearchKeydown(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (els.searchPanel.hidden || !searchResults.length) return;
            e.preventDefault();
            const n = searchResults.length;
            setSearchActive(e.key === 'ArrowDown' ? (searchActive + 1) % n : (searchActive - 1 + n) % n);
        } else if (e.key === 'Enter') {
            const target = searchResults[searchActive >= 0 ? searchActive : 0];
            if (!els.searchPanel.hidden && target) {
                e.preventDefault();
                openDetails(target.id);
            }
        } else if (e.key === 'Escape') {
            if (els.search.value) {
                els.search.value = '';
                state.query = '';
                renderList();
            }
            closeSearch();
            e.stopPropagation();
        }
    }

    function clearSearch() {
        els.search.value = '';
        state.query = '';
        closeSearch();
        renderList();
        els.search.focus();
    }

    /* ======================================================================
       Popovers (notifications, profile)
       ====================================================================== */
    const popovers = {};

    function setPopover(name, open) {
        const p = popovers[name];
        if (!p) return;
        Object.keys(popovers).forEach((other) => {
            if (other !== name && open) {
                popovers[other].panel.hidden = true;
                popovers[other].btn.setAttribute('aria-expanded', 'false');
            }
        });
        p.panel.hidden = !open;
        p.btn.setAttribute('aria-expanded', String(open));
        if (open) {
            closeSearch();
            if (canAnimate()) window.gsap.fromTo(p.panel, {opacity: 0, y: -6}, {
                opacity: 1,
                y: 0,
                duration: 0.18,
                ease: 'power2.out',
                clearProps: 'opacity,transform'
            });
        }
    }

    function closeAllPopovers() {
        Object.keys(popovers).forEach((n) => setPopover(n, false));
    }

    function renderNotifications() {
        const unread = state.notifications.filter((n) => n.unread).length;
        els.notifDot.hidden = unread === 0;
        els.notifBtn.setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications');
        els.notifMarkRead.hidden = unread === 0;
        if (!state.notifications.length) {
            els.notifList.innerHTML = `<li class="px-3 py-8 text-center text-[13.5px] text-muted-strong">You're all caught up.</li>`;
                        return;
        }
        els.notifList.innerHTML = state.notifications.map((n) => `
      <li><button type="button" class="popover-item items-start" data-action="open-notification" data-id="${esc(n.id)}">
        <span class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-pale text-teal-dark" aria-hidden="true"><i data-lucide="${esc(n.icon || 'bell')}" class="h-4 w-4"></i></span>
        <span class="min-w-0 flex-1">
          <span class="block text-[14px] leading-5 ${n.unread ? 'font-semibold' : 'font-medium text-muted-strong'}">${esc(n.text)}</span>
          <span class="block text-[12.5px] font-normal text-muted-strong">${esc(n.time || '')}</span>
        </span>
        ${n.unread ? '<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange" aria-label="Unread"></span>' : ''}
      </button></li>`).join('');
        refreshIcons();
    }

    /* ======================================================================
       Sidebar drawer (mobile)
       ====================================================================== */
    const desktopMq = window.matchMedia('(min-width: 768px)');
    let drawerOpen = false;

    /* ======================================================================
       Sidebar collapse/expand (desktop)
       ====================================================================== */
    // One <html> class drives the rail width, the main-content padding and the
    // label visibility, so all three animate together without layout jumps.
    const SIDEBAR_STATE_KEY = 'euodoo_sidebar_collapsed';
    // (els is initialised further below in this IIFE, so query directly here.)
    const sidebarToggleBtn = $('#sidebar-toggle');
    const sidebarEl = $('#sidebar');

    function isSidebarCollapsed() {
        return document.documentElement.classList.contains('sidebar-collapsed');
    }

    function syncSidebarToggle() {
        const collapsed = isSidebarCollapsed();
        sidebarToggleBtn.setAttribute('aria-expanded', String(!collapsed));
        // Tooltips stand in for the hidden labels while collapsed; they must
        // not distract in the expanded state.
        $$('a[data-nav]', sidebarEl).forEach((a) => {
            if (collapsed) a.title = (a.getAttribute('aria-label') || a.textContent).trim().replace(/\s+/g, ' ');
            else a.removeAttribute('title');
        });
        const logoutBtn = $('#sidebar-logout');
        if (collapsed && logoutBtn) logoutBtn.title = 'Sign out';
        else if (logoutBtn) logoutBtn.removeAttribute('title');
    }

    function setSidebarCollapsed(collapsed) {
        document.documentElement.classList.toggle('sidebar-collapsed', collapsed);
        try {
            localStorage.setItem(SIDEBAR_STATE_KEY, collapsed ? '1' : '0');
        } catch (err) { /* storage unavailable: state simply won't persist */ }
        // aria/roles/tooltip sync after the class change
        sidebarToggleBtn.setAttribute('aria-expanded', String(!collapsed));
        sidebarToggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
        syncSidebarToggle();
    }

    sidebarToggleBtn.addEventListener('click', () => setSidebarCollapsed(!isSidebarCollapsed()));
    desktopMq.addEventListener('change', syncSidebarToggle);
    (function initSidebarState() {
        let saved = null;
        try {
            saved = localStorage.getItem(SIDEBAR_STATE_KEY);
        } catch (err) { /* ignore */ }
        if (saved === '1' && desktopMq.matches) {
            document.documentElement.classList.add('sidebar-collapsed');
        }
        sidebarToggleBtn.setAttribute('aria-expanded', String(!isSidebarCollapsed()));
        sidebarToggleBtn.setAttribute('aria-label', isSidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar');
        syncSidebarToggle();
    })();

    function syncSidebarA11y() {
        // Off-canvas links must not be focusable while the drawer is closed.
        els.sidebar.inert = !desktopMq.matches && !drawerOpen;
    }

    function setDrawer(open, {restoreFocus = true} = {}) {
        drawerOpen = open;
        els.sidebar.dataset.open = String(open);
        els.backdrop.dataset.open = String(open);
        els.menuBtn.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('no-scroll', open);
        syncSidebarA11y();
        if (open) $('#drawer-close').focus();
        else if (restoreFocus && !desktopMq.matches) els.menuBtn.focus();
    }

    /* ======================================================================
       Account actions
       ====================================================================== */
    function logout() {
        if (window.EuodooApp) {
            EuodooApp.clearSession();
        }
        toast('Signing out...', {type: 'success'});
        setTimeout(() => {
            window.location.href = 'login.html?loggedOut=1';
        }, 400);
    }

    /* ======================================================================
       Page switching (SPA-style for demo; in production these are real routes)
       ====================================================================== */
    function renderHistoryList(tab) {
        const list = document.getElementById('history-list');
        if (!list) return;
        const items = U.filterMeetings(state.meetings, {tab: tab || 'recent'}, state.todayKey);
        if (state.status === 'loading') {
            list.innerHTML = '<p class="py-8 text-center text-[14px] text-muted-strong">Loading...</p>';
            return;
        }
        if (!items.length) {
            list.innerHTML = '<p class="py-10 text-center text-[14px] text-muted-strong">No meetings found.</p>';
            return;
        }
        list.innerHTML = items.map(rowHtml).join('');
        refreshIcons();
    }

    let historyTab = 'recent';

    function moveHistoryThumb(animate) {
        const tabsEl = document.getElementById('history-tabs');
        const thumb = document.getElementById('history-thumb');
        if (!tabsEl || !thumb) return;
        const active = tabsEl.querySelector('[aria-selected="true"]');
        if (!active || !active.offsetWidth) return;
        const x = active.offsetLeft, width = active.offsetWidth;
        if (window.gsap) {
            if (animate && canAnimate()) window.gsap.to(thumb, {x, width, duration: 0.28, ease: 'power3.out'});
            else window.gsap.set(thumb, {x, width});
        } else {
            thumb.style.transform = `translateX(${x}px)`;
            thumb.style.width = width + 'px';
        }
    }

    function initHistoryTabs() {
        const tabsEl = document.getElementById('history-tabs');
        if (!tabsEl || tabsEl.dataset.bound) return;
        tabsEl.dataset.bound = '1';
        tabsEl.querySelectorAll('[data-htab]').forEach(btn => {
            btn.addEventListener('click', () => {
                historyTab = btn.dataset.htab;
                tabsEl.querySelectorAll('[data-htab]').forEach(b => {
                    const on = b.dataset.htab === historyTab;
                    b.setAttribute('aria-selected', String(on));
                    b.tabIndex = on ? 0 : -1;
                });
                moveHistoryThumb(true);
                renderHistoryList(historyTab);
            });
        });
        // Initial thumb position after a tick so layout is ready
        setTimeout(() => moveHistoryThumb(false), 30);
    }


    /* ======================================================================
       Theme (light / dark / system)
       ====================================================================== */
    function applyTheme(theme) {
        const root = document.documentElement;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('euodoo-theme', theme);

        // Update picker active state
        document.querySelectorAll('[data-theme]').forEach(btn => {
            const active = btn.dataset.theme === theme;
            btn.classList.toggle('theme-card-active', active);
        });

        // Update header toggle icon (sun = currently light, moon = currently dark)
        const toggleIcon = document.getElementById('theme-toggle-icon');
        if (toggleIcon) {
            toggleIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
        }
        refreshIcons();
    }

    function initThemePicker() {
        const picker = document.getElementById('theme-picker');
        if (!picker || picker.dataset.bound) return;
        picker.dataset.bound = '1';
        picker.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });
    }

    function loadSavedTheme() {
        const saved = localStorage.getItem('euodoo-theme') || 'light';
        applyTheme(saved);
        // Re-apply when system preference changes (for 'system' mode)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if ((localStorage.getItem('euodoo-theme') || 'light') === 'system') applyTheme('system');
        });
    }

    function showPage(nav) {
        const mainContent = document.getElementById('main');
        const historyPage = document.getElementById('page-meeting-history');
        const settingsPage = document.getElementById('page-settings');
        const helpPage = document.getElementById('page-help');

        const profilePage = document.getElementById('page-profile');
        mainContent.hidden = false;
        historyPage.hidden = true;
        settingsPage.hidden = true;
        helpPage.hidden = true;
        if (profilePage) profilePage.hidden = true;

        document.querySelectorAll('a[data-nav]').forEach(a => {
            const on = a.dataset.nav === nav;
            a.classList.toggle('is-active', on);
            if (on) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        });

        switch (nav) {
            case 'overview':
                window.scrollTo({top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth'});
                break;
            case 'profile':
                mainContent.hidden = true;
                document.getElementById('page-profile').hidden = false;
                // Update meeting count on profile page
                const totalEl = document.getElementById('profile-total-meetings');
                if (totalEl) totalEl.textContent = state.meetings.length;
                refreshIcons();
                window.scrollTo({top: 0, behavior: 'auto'});
                if (canAnimate()) {
                    window.gsap.fromTo(document.getElementById('page-profile'), {opacity: 0, y: 12},
                        {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform'});
                }
                break;
            case 'meeting-history':
                mainContent.hidden = true;
                historyPage.hidden = false;
                initHistoryTabs();
                renderHistoryList(historyTab);
                refreshIcons();
                window.scrollTo({top: 0, behavior: 'auto'});
                if (canAnimate()) {
                    window.gsap.fromTo(historyPage, {opacity: 0, y: 12},
                        {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform'});
                }
                break;
            case 'settings':
                mainContent.hidden = true;
                settingsPage.hidden = false;
                refreshIcons();
                initThemePicker();
                loadSavedTheme();
                window.scrollTo({top: 0, behavior: 'auto'});
                if (canAnimate()) {
                    window.gsap.fromTo(settingsPage, {opacity: 0, y: 12},
                        {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform'});
                }
                break;
            case 'help':
                mainContent.hidden = true;
                helpPage.hidden = false;
                refreshIcons();
                window.scrollTo({top: 0, behavior: 'auto'});
                if (canAnimate()) {
                    window.gsap.fromTo(helpPage, {opacity: 0, y: 12},
                        {opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform'});
                }
                break;
        }
    }

    function onNavClick(e) {
        const link = e.target.closest('a[data-nav]');
        if (!link) return;
        // Admin Analytics is a separate page (admin.html), not an SPA section:
        // let the browser follow the link instead of intercepting it as a route.
        if (link.dataset.nav === 'analytics') {
            if (!desktopMq.matches) setDrawer(false, {restoreFocus: false});
            return;
        }
        if (!desktopMq.matches) setDrawer(false, {restoreFocus: false});
        e.preventDefault();
        if (!Cfg.demoMode) {
            window.location.assign(link.href);
            return;
        }
        showPage(link.dataset.nav);
    }

    /* ======================================================================
       Global event delegation
       ====================================================================== */
    function onDocumentClick(e) {
        const closeBtn = e.target.closest('[data-close]');
        if (closeBtn) {
            closeDialog(closeBtn.closest('dialog'));
            return;
        }

        const el = e.target.closest('[data-action]');
        if (el) {
            const {action, id, code, mode} = el.dataset;
            switch (action) {
                case 'join': {
                    const m = findMeeting(id);
                    if (el.hasAttribute('data-close-dialog')) closeDialog(els.detailsDlg);
                    joinMeeting(m, el);
                    break;
                }
                case 'details':
                    openDetails(id);
                    break;
                case 'copy-link':
                    copyInvite(code);
                    break;
                case 'open-create':
                    openCreate(mode);
                    break;
                case 'clear-search':
                    clearSearch();
                    break;
                case 'retry':
                    loadMeetings();
                    break;
                case 'logout':
                    closeAllPopovers();
                    logout();
                    break;
                case 'open-profile':
                    closeAllPopovers();
                    showPage('profile');
                    break;
                case 'go-back':
                    showPage('overview');
                    break;
                case 'toggle-theme': {
                    const current = localStorage.getItem('euodoo-theme') || 'light';
                    applyTheme(current === 'dark' ? 'light' : 'dark');
                    break;
                }
                case 'go-today':
                    goToToday();
                    break;
                case 'open-notification': {
                    const n = state.notifications.find((x) => x.id === id);
                    if (n) {
                        n.unread = false;
                        renderNotifications();
                    }
                    setPopover('notif', false);
                    if (n && n.meetingId && findMeeting(n.meetingId)) openDetails(n.meetingId);
                    break;
                }
                default:
                    break;
            }
        }

        // Click-away handling
        if (!e.target.closest('[data-popover-root]')) closeAllPopovers();
        if (!e.target.closest('#search-root')) closeSearch();
    }

    function onDocumentKeydown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (els.createDlg.open || els.detailsDlg.open) return;
            els.search.focus();
            els.search.select();
            return;
        }
        if (e.key === 'Escape') {
            const openPopover = Object.keys(popovers).find((n) => !popovers[n].panel.hidden);
            if (openPopover) {
                setPopover(openPopover, false);
                popovers[openPopover].btn.focus();
                return;
            }
            if (drawerOpen) setDrawer(false);
        }
    }

    /* ======================================================================
       Init
       ====================================================================== */
    function cacheElements() {
        Object.assign(els, {
            sidebar: $('#sidebar'),
            backdrop: $('#drawer-backdrop'),
            menuBtn: $('#menu-btn'),
            search: $('#global-search'),
            searchPanel: $('#search-results'),
            searchKbd: $('#search-kbd'),
            dateBtn: $('#date-btn'),
            notifBtn: $('#notif-btn'),
            notifDot: $('#notif-dot'),
            notifList: $('#notif-list'),
            notifMarkRead: $('#notif-mark-read'),
            greeting: $('#greeting'),
            greetingSub: $('#greeting-sub'),
            joinForm: $('#join-form'),
            joinInput: $('#join-input'),
            joinError: $('#join-error'),
            joinBtn: $('#join-btn'),
            joinField: $('#join-field'),
            tabs: $('#calls-tabs'),
            thumb: $('#calls-thumb'),
            list: $('#meeting-list'),
            calTitle: $('#cal-title'),
            calSub: $('#cal-sub'),
            calGrid: $('#cal-grid'),
            schTitle: $('#schedule-title'),
            schCount: $('#schedule-count'),
            schList: $('#schedule-list'),
            createDlg: $('#create-dialog'),
            createBody: $('#create-body'),
            createSuccess: $('#create-success'),
            createModes: $('#create-mode'),
            instantForm: $('#instant-form'),
            scheduleForm: $('#schedule-form'),
            instantSubmit: $('#instant-submit'),
            scheduleSubmit: $('#schedule-submit'),
            instantError: $('#instant-error'),
            scheduleError: $('#schedule-error'),
            createdEnter: $('#created-enter'),
            createdCopy: $('#created-copy'),
            detailsDlg: $('#details-dialog'),
            detailsBody: $('#details-body'),
            toasts: $('#toast-region')
        });
        popovers.notif = {btn: els.notifBtn, panel: $('#notif-popover')};
        popovers.profile = {btn: $('#profile-btn'), panel: $('#profile-popover')};
    }

    function bindEvents() {
        document.addEventListener('click', onDocumentClick);
        document.addEventListener('keydown', onDocumentKeydown);
        $('#sidebar').addEventListener('click', onNavClick);

        // Drawer
        els.menuBtn.addEventListener('click', () => setDrawer(!drawerOpen));
        els.backdrop.addEventListener('click', () => setDrawer(false));
        $('#drawer-close').addEventListener('click', () => setDrawer(false));
        const onBreakpoint = () => {
            if (desktopMq.matches && drawerOpen) setDrawer(false, {restoreFocus: false});
            syncSidebarA11y();
        };
        desktopMq.addEventListener ? desktopMq.addEventListener('change', onBreakpoint) : desktopMq.addListener(onBreakpoint);

        // Search
        els.search.addEventListener('input', onSearchInput);
        els.search.addEventListener('keydown', onSearchKeydown);
        els.search.addEventListener('focus', () => {
            if (state.query) renderSearchPanel();
        });

        // Popovers
        els.notifBtn.addEventListener('click', () => setPopover('notif', popovers.notif.panel.hidden));
        popovers.profile.btn.addEventListener('click', () => setPopover('profile', popovers.profile.panel.hidden));
        els.notifMarkRead.addEventListener('click', () => {
            state.notifications.forEach((n) => {
                n.unread = false;
            });
            renderNotifications();
        });

        // Join form
        els.joinForm.addEventListener('submit', onJoinSubmit);
        els.joinInput.addEventListener('input', () => setJoinError(''));

        // Tabs
        $$('[role="tab"]', els.tabs).forEach((btn) => btn.addEventListener('click', () => setTab(btn.dataset.tab)));
        els.tabs.addEventListener('keydown', onTabKeydown);

        // Calendar
        $('#cal-prev').addEventListener('click', () => shiftMonth(-1));
        $('#cal-next').addEventListener('click', () => shiftMonth(1));
        els.calGrid.addEventListener('click', (e) => {
            const cell = e.target.closest('.cal-cell');
            if (cell) selectDate(U.fromKey(cell.dataset.key));
        });
        els.calGrid.addEventListener('keydown', onCalendarKeydown);

        // Create dialog
        $$('[role="tab"]', els.createModes).forEach((btn) => btn.addEventListener('click', () => setCreateMode(btn.dataset.mode)));
        els.createModes.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                setCreateMode(createMode === 'instant' ? 'schedule' : 'instant', {focus: true});
            }
        });
        els.instantForm.addEventListener('submit', onInstantSubmit);
        els.scheduleForm.addEventListener('submit', onScheduleSubmit);
        $('#sch-title').addEventListener('input', () => setFieldError('sch-title', 'sch-title-error', ''));
        $('#sch-date').addEventListener('input', () => setFieldError('sch-date', 'sch-date-error', ''));
        $('#sch-time').addEventListener('input', () => setFieldError('sch-time', 'sch-time-error', ''));
        $('#sch-recurrence').addEventListener('change', () => {
            setFieldError('sch-repeat-until', 'sch-recurrence-error', '');
            updateRecurrenceUi();
        });
        $('#sch-repeat-until').addEventListener('input', () => {
            setFieldError('sch-repeat-until', 'sch-recurrence-error', '');
            updateRecurrenceUi();
        });
        els.createdCopy.addEventListener('click', () => createdMeeting && copyInvite(createdMeeting.code));
        $('#created-copy-invite').addEventListener('click', copyInviteText);
        els.createdEnter.addEventListener('click', () => {
            const m = createdMeeting;
            closeDialog(els.createDlg);
            // The creator is the stored host: joinMeeting opens Callpage.html
            // directly with the host role (never the waiting room).
            if (m) joinMeeting(m, els.createdEnter);
        });
        els.createDlg.addEventListener('close', () => {
            $('#create-title').textContent = 'New meeting';
            resetCreateDialog();
        });

        // Backdrop click closes dialogs (the dialog element itself is the backdrop target)
        [els.createDlg, els.detailsDlg].forEach((dlg) => dlg.addEventListener('click', (e) => {
            if (e.target === dlg) closeDialog(dlg);
        }));

        // Hover lift on the action cards (mouse only)
        $$('[data-hover-lift]').forEach((card) => {
            card.addEventListener('pointerenter', (e) => {
                if (e.pointerType === 'mouse' && canAnimate()) window.gsap.to(card, {
                    y: -3,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('pointerleave', () => {
                if (window.gsap) window.gsap.to(card, {y: 0, duration: 0.2, ease: 'power2.out'});
            });
        });

        // Layout changes
        const onResize = U.debounce(() => moveThumb(false), 120);
        window.addEventListener('resize', onResize);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveThumb(false));
    }

    /* Admin Analytics is only for administrators: the sidebar entry is removed
       for everyone else (matching ADMIN_EMAILS in admin.html). Client-side
       hiding is a presentation detail only — the admin.html gate AND the
       backend role check are the real authorization layers. */
    const ADMIN_EMAILS = ['kiran.s@euodoo.com'];

    function isAdminSession() {
        const s = (window.EuodooApp && EuodooApp.getSession && EuodooApp.getSession()) || state.user || {};
        return !!(s.email && ADMIN_EMAILS.includes(String(s.email).toLowerCase()));
    }

    function syncAdminLink() {
        document.querySelectorAll('[data-admin-only]').forEach((el) => {
            if (!isAdminSession()) el.remove();
        });
    }

    async function init() {
        if (!U) {
            console.error('meet-utils.js must load before dashboard.js');
            return;
        }
        cacheElements();
        syncAdminLink();

        state.today = getToday();
        state.todayKey = U.toKey(state.today);
        state.selected = state.today;
        state.viewMonth = {year: state.today.getFullYear(), month: state.today.getMonth()};

        if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) els.searchKbd.textContent = '�OE~ K';

        renderUser();
        renderDate();
        renderGreeting();
        renderCalendar();
        renderSchedule();
        renderList();
        syncSidebarA11y();
        bindEvents();
        refreshIcons();
        moveThumb(false);
        playEntrance();
        loadSavedTheme();

        MeetingService.notifications()
            .then((items) => {
                state.notifications = items;
                renderNotifications();
            })
            .catch(() => {
                state.notifications = [];
                renderNotifications();
            });

        await loadMeetings();

        // Expose helpers for inline onclick in pages
        window.EuodooDash = {
            settingsSaved: () => toast('Settings saved.', {type: 'success'}),
            helpSent: () => toast('Message sent! We will get back to you shortly.', {type: 'success'})
        };
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();