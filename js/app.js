/**
 * Euodoo Meet - Shared Application Integration Layer
 * =========================================================================
 * Coordinates authentication session state, meeting navigation,
 * multi-tab host admission demo synchronization, and the meeting page contract:
 *
 *   login.html -> registration.html -> dashboard.html -> waitingpage.html (participants)
 *                                                              \-> Callpage.html (host / admitted participants)
 * =========================================================================
 */

(function (window) {
    'use strict';

    /* =====================================================================
       1. CALL PAGE INTEGRATION CONTRACT
       ---------------------------------------------------------------------
       Callpage.html is the single meeting/call interface for this demo.
       The host enters it directly after creating a meeting; participants
       wait on waitingpage.html and are redirected here once admitted.

       Integration Contract:
         - Target URL: MEETING_PAGE_URL + "?meetingId=" + encodeURIComponent(meetingId)
         - Authentication Context: Stored in sessionStorage under 'euodoo_session'
         - Meeting Context: Stored in sessionStorage under 'euodoo_meeting'
         - User can read both anytime via EuodooApp.getSession() and EuodooApp.getMeeting()
       ===================================================================== */
    const MEETING_PAGE_URL = 'Callpage.html';

    /* =====================================================================
       2. Storage Keys
       ===================================================================== */
    const STORAGE_KEYS = {
        SESSION: 'euodoo_session',
        MEETING: 'euodoo_meeting',
        DEMO_USERS: 'euodoo_demo_registered_users',
        // Multi-tab synchronization key for host admission:
        // Stored in localStorage so browser 'storage' events fire across tabs
        ADMISSION_REQUESTS: 'euodoo_admission_requests',
        // Demo meeting registry: maps meeting code -> meeting record (host identity, state)
        DEMO_MEETINGS: 'euodoo_demo_meetings',
        // Active meeting roster: maps meeting code -> array of admitted participants
        MEETING_ROSTERS: 'euodoo_meeting_rosters'
    };

    /* Default host emails for the dashboard's seeded sample meetings, so the
       demo role check works even before the user creates a meeting. */
    const DEMO_SAMPLE_MEETING_HOSTS = {
        'pdk-wmqe-rtn': 'kiran.s@euodoo.com',
        'prv-hzlc-xaq': 'kiran.s@euodoo.com',
        'ins-bvfd-ouy': 'kiran.s@euodoo.com',
        'stn-ujgk-ecp': 'kiran.s@euodoo.com',
        'fpl-qtxr-mhs': 'kiran.s@euodoo.com',
        'skf-lndw-zoa': 'kiran.s@euodoo.com',
        'dcr-ypeh-vbi': 'kiran.s@euodoo.com',
        'cld-mxfa-gkt': 'kiran.s@euodoo.com',
        'bsy-owtc-rje': 'kiran.s@euodoo.com',
        'rrt-qzia-nhu': 'kiran.s@euodoo.com',
        'spl-rdvb-wyk': 'kiran.s@euodoo.com'
    };

    /**
     * Compute initials from a name string (e.g. "Kiran S" -> "KS")
     */
    function getInitials(name) {
        if (!name) return 'EM';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    /**
     * Safe JSON parser for storage values
     */
    function safeParse(jsonStr, fallback = null) {
        if (!jsonStr) return fallback;
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            return fallback;
        }
    }

    /* =====================================================================
       3. Main EuodooApp Interface
       ===================================================================== */
    const EuodooApp = {
        MEETING_PAGE_URL: MEETING_PAGE_URL,

        // ----------------- Authentication & Session -----------------
        getSession() {
            try {
                return safeParse(sessionStorage.getItem(STORAGE_KEYS.SESSION), null);
            } catch (e) {
                return null;
            }
        },

        setSession(user) {
            if (!user) return;
            const normalized = {
                name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Demo User',
                firstName: user.firstName || (user.name ? user.name.split(' ')[0] : 'Demo'),
                lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : 'User'),
                email: user.email || 'user@euodoo.com',
                initials: user.initials || getInitials(user.name || `${user.firstName || ''} ${user.lastName || ''}`),
                role: user.role || 'User',
                loggedInAt: new Date().toISOString()
            };
            try {
                sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(normalized));
            } catch (e) {
                console.error('[EuodooApp] Failed to save session:', e);
            }
            return normalized;
        },

        clearSession() {
            try {
                sessionStorage.removeItem(STORAGE_KEYS.SESSION);
                sessionStorage.removeItem(STORAGE_KEYS.MEETING);
            } catch (e) {}
        },

        isLoggedIn() {
            return !!this.getSession();
        },

        requireAuth(redirectTo = 'login.html', allowDemoAutoLogin = false) {
            const session = this.getSession();
            if (!session) {
                if (allowDemoAutoLogin) {
                    return this.setSession({
                        name: 'Kiran S',
                        firstName: 'Kiran',
                        lastName: 'S',
                        email: 'kiran.s@euodoo.com',
                        initials: 'KS',
                        role: 'User'
                    });
                }
                window.location.href = redirectTo;
                return null;
            }
            return session;
        },

        registerDemoUser(userData) {
            try {
                const users = safeParse(localStorage.getItem(STORAGE_KEYS.DEMO_USERS), {});
                const email = (userData.email || '').toLowerCase().trim();
                if (email) {
                    users[email] = {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        name: `${userData.firstName} ${userData.lastName}`.trim(),
                        email: email,
                        initials: getInitials(`${userData.firstName} ${userData.lastName}`),
                        role: 'User'
                    };
                    localStorage.setItem(STORAGE_KEYS.DEMO_USERS, JSON.stringify(users));
                }
            } catch (e) {}
        },

        findDemoUser(email) {
            try {
                const users = safeParse(localStorage.getItem(STORAGE_KEYS.DEMO_USERS), {});
                return users[(email || '').toLowerCase().trim()] || null;
            } catch (e) {
                return null;
            }
        },

        // ----------------- Meeting Context Management -----------------
        getMeeting() {
            try {
                return safeParse(sessionStorage.getItem(STORAGE_KEYS.MEETING), null);
            } catch (e) {
                return null;
            }
        },

        setMeeting(meeting) {
            if (!meeting) return;
            const data = {
                id: meeting.id || meeting.code || 'meeting-' + Date.now(),
                code: meeting.code || meeting.id || '982-451-032',
                title: meeting.title || 'Project Discussion',
                isHost: !!meeting.isHost,
                date: meeting.date || new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };
            try {
                sessionStorage.setItem(STORAGE_KEYS.MEETING, JSON.stringify(data));
            } catch (e) {
                console.error('[EuodooApp] Failed to save meeting context:', e);
            }
            return data;
        },

        clearMeeting() {
            try {
                sessionStorage.removeItem(STORAGE_KEYS.MEETING);
            } catch (e) {}
        },

        // ----------------- Page Navigation Helpers -----------------
        goToDashboard() {
            window.location.href = 'dashboard.html';
        },

        goToLogin() {
            window.location.href = 'login.html';
        },

        goToRegistration() {
            window.location.href = 'registration.html';
        },

        goToWaitingRoom(meetingId, meetingTitle) {
            if (!meetingId) return;
            let url = 'waitingpage.html?meetingId=' + encodeURIComponent(meetingId);
            if (meetingTitle) {
                url += '&meetingTitle=' + encodeURIComponent(meetingTitle);
            }
            window.location.href = url;
        },

        goToCallPage(meetingId, meetingTitle) {
            let url = 'Callpage.html';
            if (meetingId) url += '?meetingId=' + encodeURIComponent(meetingId);
            if (meetingTitle) url += '&meetingTitle=' + encodeURIComponent(meetingTitle);
            window.location.href = url;
        },

        goToMeetingPage(meetingId) {
            const id = meetingId || (this.getMeeting() ? this.getMeeting().code : '');
            if (!id) {
                // Toast notification instead of a native browser alert.
                const msg = 'No meeting ID found. Please join a meeting from the dashboard.';
                if (window.EuodooToast) EuodooToast.toast(msg, {type: 'error'});
                else console.warn(msg);
                return;
            }
            const target = this.MEETING_PAGE_URL + '?meetingId=' + encodeURIComponent(id);
            window.location.href = target;
        },

        // =====================================================================
        // Demo Meeting Registry (host identity) + Roster layer
        // =====================================================================
        /**
         * Register a demo meeting and its designated host.
         * This is the ONLY way a meeting gets a host in the demo: the identity is
         * stored when the meeting is created (or seeded for the sample meetings),
         * never derived from URL parameters.
         */
        registerDemoMeeting(codeOrTitle, titleOrHost, hostArg) {
            let code, title, hostUser;
            if (typeof codeOrTitle === 'object' && codeOrTitle !== null) {
                code = codeOrTitle.code || codeOrTitle.id;
                title = codeOrTitle.title;
                hostUser = titleOrHost;
            } else {
                code = codeOrTitle;
                title = titleOrHost;
                hostUser = hostArg;
            }
            if (!code) return null;
            code = String(code).trim();
            const meetings = safeParse(localStorage.getItem(STORAGE_KEYS.DEMO_MEETINGS), {});
            const existing = meetings[code];
            if (existing && existing.hostEmail) return existing; // never overwrite the host
            const record = {
                code: code,
                title: title || 'Meeting',
                hostEmail: ((hostUser && hostUser.email) || 'kiran.s@euodoo.com').toLowerCase().trim(),
                hostName: (hostUser && hostUser.name) || 'Kiran S',
                hostInitials: (hostUser && hostUser.initials) || 'KS',
                sampleParticipants: existing && existing.sampleParticipants != null ? existing.sampleParticipants : true,
                createdAt: Date.now(),
                status: 'active',
                endedAt: null
            };
            meetings[code] = record;
            try {
                localStorage.setItem(STORAGE_KEYS.DEMO_MEETINGS, JSON.stringify(meetings));
            } catch (e) {}
            return record;
        },

        /** Seed host records for the dashboard's built-in sample meetings. */
        seedSampleMeetings() {
            const titles = {
                'pdk-wmqe-rtn': 'Project Discussion', 'prv-hzlc-xaq': 'Project Review',
                'ins-bvfd-ouy': 'Interns Session', 'stn-ujgk-ecp': 'Standup',
                'fpl-qtxr-mhs': 'Frontend Planning', 'skf-lndw-zoa': 'Sprint Kickoff',
                'dcr-ypeh-vbi': 'Design Critique', 'cld-mxfa-gkt': 'Client Demo',
                'bsy-owtc-rje': 'Backend Sync', 'rrt-qzia-nhu': 'Release Retro',
                'spl-rdvb-wyk': 'Sprint Planning'
            };
            const meetings = safeParse(localStorage.getItem(STORAGE_KEYS.DEMO_MEETINGS), {});
            Object.keys(DEMO_SAMPLE_MEETING_HOSTS).forEach((code) => {
                if (meetings[code]) return;
                meetings[code] = {
                    code: code,
                    title: titles[code] || 'Sample Meeting',
                    hostEmail: DEMO_SAMPLE_MEETING_HOSTS[code],
                    hostName: 'Kiran S',
                    hostInitials: 'KS',
                    sampleParticipants: true,
                    createdAt: Date.now(),
                    status: 'active',
                    endedAt: null
                };
            });
            try {
                localStorage.setItem(STORAGE_KEYS.DEMO_MEETINGS, JSON.stringify(meetings));
            } catch (e) {}
        },

        getDemoMeeting(code) {
            if (!code) return null;
            const meetings = safeParse(localStorage.getItem(STORAGE_KEYS.DEMO_MEETINGS), {});
            return meetings[String(code).trim()] || null;
        },

        /**
         * Resolve the current user's role for a meeting.
         * 'HOST' only when the meeting record's stored host email matches the
         * logged-in session email. URL parameters are never trusted.
         * Returns 'PARTICIPANT' when information is missing (safe default).
         */
        getMeetingRole(code) {
            const session = this.getSession();
            const record = this.getDemoMeeting(code);
            if (!session || !record || !session.email) return 'PARTICIPANT';
            const sessionId = String(session.email).toLowerCase().trim();
            return sessionId === record.hostEmail ? 'HOST' : 'PARTICIPANT';
        },

        isHostForMeeting(code) {
            return this.getMeetingRole(code) === 'HOST';
        },

        /** Update a demo meeting record (ended state, sample toggle, ...). */
        updateDemoMeeting(code, patch) {
            if (!code) return null;
            const meetings = safeParse(localStorage.getItem(STORAGE_KEYS.DEMO_MEETINGS), {});
            const k = String(code).trim();
            if (!meetings[k]) return null;
            Object.assign(meetings[k], patch || {});
            if (patch && patch.endedAt && !meetings[k].status) meetings[k].status = 'ended';
            try {
                localStorage.setItem(STORAGE_KEYS.DEMO_MEETINGS, JSON.stringify(meetings));
            } catch (e) {}
            return meetings[k];
        },

        endMeeting(code) {
            const record = this.updateDemoMeeting(code, {endedAt: Date.now()});
            this.setRoster(code, []); // meeting over: roster is cleared in every tab
            return record;
        },

        listenToMeetingRecord(code, onUpdate) {
            if (typeof onUpdate !== 'function') return () => {};
            const check = () => onUpdate(this.getDemoMeeting(code));
            const storageHandler = (e) => {
                if (e.key === STORAGE_KEYS.DEMO_MEETINGS) check();
            };
            window.addEventListener('storage', storageHandler);
            const intervalId = setInterval(check, 2500);
            return function stopListening() {
                window.removeEventListener('storage', storageHandler);
                clearInterval(intervalId);
            };
        },

        setSampleParticipantsForMeeting(code, on) {
            return this.updateDemoMeeting(code, {sampleParticipants: !!on});
        },

        // ----------------- Active Meeting Roster (admitted participants) -----------------
        /**
         * The roster holds only participants who were admitted (plus the host).
         * Pending people live only in admission requests / the host waiting panel.
         * Structure: { [meetingCode]: [{ uid, name, initials, host, joinedAt }] }
         */
        getRoster(meetingCode) {
            try {
                const rosters = safeParse(localStorage.getItem(STORAGE_KEYS.MEETING_ROSTERS), {});
                return rosters[String(meetingCode || '').trim()] || [];
            } catch (e) {
                return [];
            }
        },

        _saveRoster(meetingCode, roster) {
            try {
                const rosters = safeParse(localStorage.getItem(STORAGE_KEYS.MEETING_ROSTERS), {});
                rosters[String(meetingCode).trim()] = roster;
                localStorage.setItem(STORAGE_KEYS.MEETING_ROSTERS, JSON.stringify(rosters));
            } catch (e) {}
        },

        addRosterMember(meetingCode, member) {
            const code = String(meetingCode || '').trim();
            if (!code || !member || !member.uid) return this.getRoster(code);
            const roster = this.getRoster(code);
            if (roster.some((m) => m.uid === String(member.uid).toLowerCase().trim())) return roster; // avoid duplicates
            roster.push({
                uid: String(member.uid).toLowerCase().trim(),
                name: member.name || 'Participant',
                initials: member.initials || 'EM',
                host: !!member.host,
                joinedAt: member.joinedAt || Date.now()
            });
            this._saveRoster(code, roster);
            return roster;
        },

        ensureHostInRoster(meetingCode, hostUser) {
            const code = String(meetingCode || '').trim();
            const session = this.getSession();
            const uid = hostUser && hostUser.uid ? hostUser.uid : (hostUser && hostUser.email) || (session && session.email);
            const name = (hostUser && hostUser.name) || (session && session.name) || 'Host';
            if (!uid || !code) return this.getRoster(code);
            return this.addRosterMember(code, {
                uid: uid,
                name: name,
                initials: (hostUser && hostUser.initials) || (session && session.initials) || 'HO',
                host: true
            });
        },

        removeRosterMember(meetingCode, uid) {
            const code = String(meetingCode || '').trim();
            if (!code || !uid) return this.getRoster(code);
            const roster = this.getRoster(code);
            const next = roster.filter((m) => m.uid !== String(uid).toLowerCase().trim());
            this._saveRoster(code, next);
            return next;
        },

        setRoster(meetingCode, roster) {
            const code = String(meetingCode || '').trim();
            if (!code) return [];
            this._saveRoster(code, Array.isArray(roster) ? roster : []);
            return this.getRoster(code);
        },

        /** Listen for roster changes for one meeting (storage event + poll fallback). */
        listenToRoster(meetingCode, onUpdate) {
            if (typeof onUpdate !== 'function') return () => {};
            const check = () => onUpdate(this.getRoster(meetingCode));
            const storageHandler = (e) => {
                if (e.key === STORAGE_KEYS.MEETING_ROSTERS) check();
            };
            window.addEventListener('storage', storageHandler);
            const intervalId = setInterval(check, 1500);
            check();
            return function stopListening() {
                window.removeEventListener('storage', storageHandler);
                clearInterval(intervalId);
            };
        },

        // ----------------- Multi-Tab Admission State Layer -----------------
        /**
         * Fetch all admission requests from localStorage
         * Structure: { [requestId]: { requestId, meetingId, meetingTitle, userName, userInitials, userEmail, status, requestedAt, decisionAt } }
         */
        getAllAdmissionRequests() {
            try {
                return safeParse(localStorage.getItem(STORAGE_KEYS.ADMISSION_REQUESTS), {});
            } catch (e) {
                return {};
            }
        },

        _saveAdmissionRequests(requestsMap) {
            try {
                localStorage.setItem(STORAGE_KEYS.ADMISSION_REQUESTS, JSON.stringify(requestsMap));
            } catch (e) {
                console.error('[EuodooApp] Failed to save admission requests:', e);
            }
        },

        /**
         * Create or refresh a join request for a participant entering waitingpage.html
         * Statuses: 'PENDING' | 'ADMITTED' | 'DECLINED' | 'CANCELLED'
         */
        createJoinRequest(meetingId, meetingTitle, user) {
            const requests = this.getAllAdmissionRequests();
            const normalizedMeetingId = (meetingId || '982-451-032').trim();

            // Look for existing pending request in this session tab
            let requestId = sessionStorage.getItem('euodoo_my_request_id');
            if (requestId && requests[requestId] && requests[requestId].meetingId === normalizedMeetingId && requests[requestId].status === 'PENDING') {
                return requests[requestId];
            }

            // Generate unique request ID
            requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            sessionStorage.setItem('euodoo_my_request_id', requestId);

            const requestObj = {
                requestId: requestId,
                meetingId: normalizedMeetingId,
                meetingTitle: meetingTitle || 'Project Discussion',
                userName: (user && user.name) || 'Kiran S',
                userInitials: (user && user.initials) || 'KS',
                userEmail: (user && user.email) || 'participant@euodoo.com',
                status: 'PENDING',
                requestedAt: Date.now(),
                decisionAt: null
            };

            requests[requestId] = requestObj;
            this._saveAdmissionRequests(requests);
            return requestObj;
        },

        /**
         * Get a single join request by ID
         */
        getJoinRequest(requestId) {
            if (!requestId) return null;
            const requests = this.getAllAdmissionRequests();
            return requests[requestId] || null;
        },

        /**
         * Get all requests for a specific meeting ID, sorted by request time
         */
        getRequestsForMeeting(meetingId) {
            const requests = this.getAllAdmissionRequests();
            const list = Object.values(requests);
            if (!meetingId || meetingId === 'ALL') {
                return list.sort((a, b) => b.requestedAt - a.requestedAt);
            }
            return list
                .filter((r) => r.meetingId === meetingId)
                .sort((a, b) => b.requestedAt - a.requestedAt);
        },

        /**
         * Host admits participant.
         * Also adds the participant to the meeting roster so the host's call page
         * participant grid and count update across tabs (localStorage + storage event).
         */
        admitParticipant(requestId) {
            const requests = this.getAllAdmissionRequests();
            if (!requests[requestId] || requests[requestId].status !== 'PENDING') {
                // Handle duplicate clicks / stale decisions: only pending requests can flip.
                return false;
            }
            requests[requestId].status = 'ADMITTED';
            requests[requestId].decisionAt = Date.now();
            this._saveAdmissionRequests(requests);
            const req = requests[requestId];
            this.addRosterMember(req.meetingId, {
                uid: req.userEmail || req.requestId,
                name: req.userName,
                initials: req.userInitials,
                host: false
            });
            return true;
        },

        /**
         * Host declines participant
         */
        declineParticipant(requestId) {
            const requests = this.getAllAdmissionRequests();
            if (!requests[requestId] || requests[requestId].status !== 'PENDING') return false;
            requests[requestId].status = 'DECLINED';
            requests[requestId].decisionAt = Date.now();
            this._saveAdmissionRequests(requests);
            return true;
        },

        /**
         * Participant cancels their own request
         */
        cancelJoinRequest(requestId) {
            const requests = this.getAllAdmissionRequests();
            if (!requests[requestId]) return false;
            requests[requestId].status = 'CANCELLED';
            requests[requestId].decisionAt = Date.now();
            this._saveAdmissionRequests(requests);
            return true;
        },

        /**
         * Participant rejoins
         */
        rejoinMeeting(requestId, meetingId, meetingTitle, user) {
            const requests = this.getAllAdmissionRequests();
            if (requestId && requests[requestId]) {
                requests[requestId].status = 'PENDING';
                requests[requestId].requestedAt = Date.now();
                requests[requestId].decisionAt = null;
                this._saveAdmissionRequests(requests);
                return requests[requestId];
            }
            return this.createJoinRequest(meetingId, meetingTitle, user);
        },

        /**
         * Listen for status updates for a specific join request (used by participant in waitingpage.html)
         * Combines browser 'storage' event for cross-tab notifications + short polling fallback
         */
        listenToRequest(requestId, onStatusChange) {
            if (!requestId || typeof onStatusChange !== 'function') return () => {};

            let lastStatus = 'PENDING';

            const check = () => {
                const req = this.getJoinRequest(requestId);
                if (req && req.status !== lastStatus) {
                    lastStatus = req.status;
                    onStatusChange(req.status, req);
                }
            };

            const storageHandler = (e) => {
                if (e.key === STORAGE_KEYS.ADMISSION_REQUESTS) {
                    check();
                }
            };

            window.addEventListener('storage', storageHandler);
            const intervalId = setInterval(check, 1000);

            // Cleanup function to prevent duplicate timers and memory leaks
            return function stopListening() {
                window.removeEventListener('storage', storageHandler);
                clearInterval(intervalId);
            };
        },

        /**
         * Listen for any request updates for a meeting (used by the host inside
         * Callpage.html's host-only waiting-room panel)
         */
        listenToMeetingRequests(meetingId, onUpdate) {
            if (typeof onUpdate !== 'function') return () => {};

            const check = () => {
                const list = this.getRequestsForMeeting(meetingId);
                onUpdate(list);
            };

            const storageHandler = (e) => {
                if (e.key === STORAGE_KEYS.ADMISSION_REQUESTS) {
                    check();
                }
            };

            window.addEventListener('storage', storageHandler);
            const intervalId = setInterval(check, 1200);

            return function stopListening() {
                window.removeEventListener('storage', storageHandler);
                clearInterval(intervalId);
            };
        }
    };

    EuodooApp.seedSampleMeetings();
    window.EuodooApp = EuodooApp;
})(window);
