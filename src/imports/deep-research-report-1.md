# Executive Summary  
**Scrolln't** is a minimalist, Gen Z–friendly focus app that turns screen‑free time into a fun, social challenge. Users start a “lock‑in” focus session (e.g. 30 min) during which distracting apps (Insta, TikTok, etc.) are blocked or obscured. Completing sessions builds streaks and XP, and friends can join via shareable links to focus together. Unlike heavy productivity apps, Scrolln't is dark-themed, meme‑laced and easy to use. Its one‑line value proposition: **“Stay off your phone with friends – lock in, beat the scroll.”**  

This plan outlines a Day1/Day2 MVP and Week1 roadmap. It specifies exact screens (Onboarding, Home/Timer, Stats, Squads, Settings, and consent flows) with UI elements and microcopy. It details the Android tech (UsageStats, AccessibilityService, DND) needed for blocking, with required permissions and tradeoffs. Privacy prompts are provided for requesting permissions (e.g. app‑block). A minimal tech stack (React Native/Expo, AsyncStorage), sample data schema, and optional backend API stubs are sketched. Key analytics (events, funnels, retention goals) and viral hooks (invite links, shareable streaks) are covered. Competitors (Forest, Opal, StayFree, OneSec, Beave, Stay Focused) are compared in a feature table. Finally, we propose a 48‑hour QA plan, risks (device compliance, Play policy on Accessibility) and mitigations, and include **actionable GPT/Gemini prompts** for code and PRD generation.  

# Product Definition & Value Proposition  
**Product:** Scrolln't – a gamified focus-timer app for young users. It blocks distracting apps and rewards focus with “XP” and hilarious notifications. Features include single-user Pomodoro-style sessions and optional “squads” where friends lock their phones together. 

**Value Proposition (one-liner):** *“Lock in focus with Scrolln't – block the scroll, hit your goals, and flex your streaks with friends.”*  

Unlike serious blockers (Forest, Opal) that feel like work or parental controls, Scrolln't is playful (“Abe cooked” alerts, Moai statue mascot) and social (invite buddies, squad XP). It appeals to Gen Z by speaking their language and adding humor to productivity.    

# MVP Feature List (Prioritized)  

| **Feature**                  | **Priority** | **Description** | **Acceptance Criteria**                              |
|------------------------------|-------------:|----------------|------------------------------------------------------|
| **Focus Timer Screen**       | Day1         | Single-session Pomodoro timer with start/stop.       | Timer counts down; pausing/ending updates streak.    |
| **App-blocking (single-user)** | Day1      | Prevent or overlay banned apps during session.       | If user opens a blocked app, a full-screen message appears (with “Give Up” or “Stay on track” option). Blocking requires only during active sessions. |
| **Streak & XP Tracking**      | Day1         | Counts days of consecutive sessions, accumulates XP. | Completing a session increments streak and XP; ending early resets streak. |
| **Dark UI Theme**             | Day1         | App-wide dark color scheme with neon accents.       | Colors match palette; switches to dark mode automatically or manually.   |
| **Splash & Onboarding**       | Day1–Day2    | Simple intro screens explaining the app concept.    | Onboarding (3 slides max) shows app name, mascot, and invites enabling permissions. “Done” leads to Home.   |
| **Stats Screen**              | Day2         | Summary of focus history (weekly totals, best streak). | Displays total hours focused, current streak, best streak, sessions count. (Graphs optional.) |
| **Settings Screen**           | Day2         | Allow toggling sounds/notifications, view privacy info. | Toggles for enabling/disabling humor alerts, snack bars, tutorial reset. Includes a “Privacy & Permissions” section. |
| **Squad Creation/Join**      | Week1        | Create a group (squad) and invite code/link.        | User can generate or enter a 6-digit squad code. Inviting uses Share sheet to copy link/text. |
| **Squad Focus Session (PvP)** | Week1        | Multiple users start session; one’s failure resets all. | All squad members see session start; if any opens a blocked app, all get a “Your squad lost!” alert. Streak recorded per squad if all complete. |
| **Progressive Onboarding Prompts** | Week1   | In-app hints (e.g. “Invite friends for double XP!”). | Pop-ups or coach marks appear when viewing Stats (“Invite friends to double your XP!”).   |

Each feature’s acceptance criteria should be verified by running the app on a device. For example, starting a Focus Timer should immediately begin the countdown and disable the Start button until the timer stops. Completing a session should increment the streak and unlock a celebratory toast (“+250 XP: Locked In!”). Attempting to open a blocked app during an active session must trigger an overlay screen or auto-home action (as in Beave’s blocker).  

# Screen List & UI Microcopy  

1. **Splash / Welcome:**  
   - Logo (stylized “Scrolln't” or “Scrolln’t” with a Moai face icon).  
   - Quick tagline: *“Stop scrolling. Start living.”* (See Ideas above).  
   - Fade into Onboarding.  

2. **Onboarding (3 slides):**  
   - **Slide 1 (Welcome):** Headline: “Welcome to Scrolln't!” Text: *“Lock away distractions and claim your focus streak.”*  
   - **Slide 2 (Feature Highlight):** E.g. image of phone screen-down. Caption: *“Face-down focus – or run your own focus timer.”*  
   - **Slide 3 (Privacy/Permission Hint):** Explain needed permission: *“We’ll ask to block apps so you can lock in. No personal data collected.”* Button: “Let’s Go!” leads to Home.  

3. **Home / Timer Screen:**  
   - **Top bar:** Title “Focus Mode”. Option: ⚙︎ Settings icon.  
   - **Main:** Large countdown timer (00:30:00). Below it, two buttons: *“Start” (green)* and *“Duration” (grey, to set time)*. Microcopy under timer: “You won’t be able to open Instagram while locked.”  
   - **During Session:** *“Stop” (red) and “Give Up” (danger) buttons.* A faint overlay or badge shows current streak (e.g. 🔥 Streak: 5d) at corner.  
   - **Copy Example:** When pressing Start: “Session started. Go get that XP!” After time up: “Session complete! You earned 250 XP.”  

4. **Stats Screen:**  
   - **Charts or Cards:** “This Week’s Focus: 3h 20m” with bar graph of daily focus time. “Current Streak: 3 days,” “Best Streak: 7 days.”  
   - **Buttons:** “Share my streak” (copies a message like “I’m on a 3-day focus streak in @Scrollnt!”).  
   - **Copy Example:** “Nice work – 3 focus sessions this week. Keep it up!”  

5. **Squads Screen:** (if implementing):  
   - **Two Tabs:** “My Squads” and “Join Squad”.  
   - **My Squads:** List of joined squads with name (or code) and current squad streak. Button “+ New Squad”.  
   - **Join Squad:** Input for 6-digit code or “Invite Link” share button.  
   - **In-Squad View:** Once in a squad, show “Squad Code: ABC123” and list of members (just names or IDs) with avatar. Button “Start Squad Focus”. If anyone fails, show: “💔 Squad streak broken by @User!”  

6. **Settings Screen:**  
   - Toggles: “Sound effects,” “Achievements pop-ups,” “Confirm exit focus (hardcore mode).”  
   - Button: “Reset Tutorial.”  
   - **Permissions & Privacy:** Link to a mini-privacy policy. Prominent disclosure: *“Scrolln't uses AccessibilityService only to enforce focus sessions – we never collect personal data.”*  

7. **Permission / Consent Flows:**  
   - On first app-block feature use, show an in-app dialog: *“Scrolln't needs to see which apps are in the foreground so it can lock the screen during focus sessions. No data leaves your phone. Click OK to go to Settings.”* Then direct to Usage Access or Accessibility toggle. (This follows Google’s prominent disclosure guidance.)  
   - Example wording in app (like [19]): *“We use the Accessibility Service only for focus locking. We do not collect or send any info.”*  

8. **Error / Info Pop-ups:**  
   - If user hasn’t granted Usage Access: *“To block apps, enable Usage Access for Scrolln't in Settings.”* with button to open settings.  
   - If user tries to exit focus early: *“Session aborted. Streak reset to 0.”*  

All microcopy should be punchy and relatable (use emojis sparingly, e.g. 🤳 🚫 🙌). The mascot (moai 🗿 or cactus 🌵) can appear in empty states (“No focus data yet. Let’s start a session!”) or celebratory messages.  

# UX Flows  

```mermaid
flowchart TD
  A[Onboarding] --> B[Home/Timer]
  B --> C{Start Focus?}
  C -->|Yes| D[Timer Counting]
  C -->|No| E[Home (idle)]
  D --> F{Time Up?}
  F -->|Yes| G[Focus Complete → Streak+XP]
  F -->|Stop button| H[Give Up → Streak Reset]
  G --> B
  H --> B

  subgraph Squad Flow
    I[Home: Create/Join Squad] --> J[Join code entry or share link]
    J --> K[Squad Lobby: waiting for 2+ players]
    K --> L[Start Squad Session (all ready)]
    L --> M[Each user’s Timer Running]
    M --> N{All Complete?}
    N -->|All Yes| O[Squad Success: Squad Streak+]
    N -->|Someone quits| P[Squad Fail: Notify All]
    O --> K
    P --> K
  end

  click A "Onboarding Screen" "Onboarding Screen"
  click B "Home/Timer Screen" "Home/Timer Screen"
  click G "Focus Complete" "Focus complete -> update Stats"
  click H "Session Fail" "Give up -> reset streak"
  click I "Squad Entry" "Squad creation/join screen"
  click P "Squad Fail" "Someone broke focus -> notify squad"
```

- **Single-user flow:** New user sees Onboarding → taps to get Started → Home/Timer screen. They set a duration (default 30m) and press *Start*. The timer runs; if time expires, they see a “Success” message (increment streak); if they press Stop/Give Up early, they see “Session aborted” and streak resets. Afterwards, they can view Stats or start a new session.  

- **Squad PvP flow:** From Home or a dedicated “Squads” tab, the user creates a new Squad or joins with a code. Once 2+ players are in the squad, any member can start a Squad Focus. All members’ apps show a synchronized timer and block apps. If *everyone* completes, the entire squad gains XP and the squad streak increments. If *anyone* exits early, all members immediately see a “Squad lost” alert and the squad streak resets (similar to Forest’s “plant together” feature). This social accountability is a viral hook – e.g. “@Alice opened TikTok 😆 – Squad Lock broken!” (sent in-app, not automated to chat).  

# Android Technical Feasibility  

**App-blocking approaches:** On Android, we cannot truly “lock out” apps without special privileges. However, Scrolln't can **detect** when a user tries to open a blocked app and then intervene. Two main methods:  

- **UsageStatsManager (Recommended):** Request the `PACKAGE_USAGE_STATS` permission (marker permission). This lets the app query what app is in the foreground. With a background service (active only during focus sessions), the app periodically checks `UsageStatsManager.queryEvents()` or `queryUsageStats()` for recent app events. If a blocked app appears, Scrolln't can immediately overlay its own full-screen “Focus Mode” UI (using `SYSTEM_ALERT_WINDOW`) to cover the screen. This mimics a block. This approach avoids AccessibilityService and is allowed by Play Store (just requires the user to grant **Usage Access** in Settings). Tradeoff: updates may be slightly delayed (depending on polling interval), but battery impact is low.  

- **AccessibilityService (Advanced):** As an alternative, Scrolln't could offer an Accessibility Service which monitors window focus events. In `onAccessibilityEvent`, the service can detect when a target app’s UI appears and immediately call `performGlobalAction(GLOBAL_ACTION_HOME)` or show an overlay. This gives near-instant blocking. However, Google’s policy requires a *prominent disclosure* if using Accessibility for non-disability purposes. We must include an in-app dialog and Play Store disclosure “Scrolln't uses AccessibilityService only to lock the screen during focus sessions. No data is collected.”. Given the added friction, we should try UsageStats first and reserve Accessibility as a fallback for stricter blocking on Android 14+.  

- **Display-Over-Other-Apps:** In either case, to truly obstruct an app, we use the “draw over other apps” permission (`SYSTEM_ALERT_WINDOW`). This allows showing a full-screen View that covers any foreground app. Ask the user for this permission during setup (with disclosure).  

- **Do Not Disturb (DND):** Optional: obtain `ACCESS_NOTIFICATION_POLICY` to silence notifications during focus. Not strictly needed but improves UX. We can briefly engage DND (`NotificationManager.setInterruptionFilter`) at focus start and restore afterwards. This requires sending the user to the DND settings (Android Marshmallow+) for consent.  

- **Work Profile / Device Owner:** Not used for MVP. Setting up a work profile or device owner for focus mode is complex and not practical for a consumer app.  

**Permissions & Reliability:** Scrolln't will need:  
  - **`PACKAGE_USAGE_STATS`** (Usage Access): user must grant via Settings. If denied, we fall back to just timing without block.  
  - **`SYSTEM_ALERT_WINDOW`** (Overlay): ask on first block attempt.  
  - **Optional `AccessibilityService`** (if used): user must explicitly enable it in Accessibility settings. Use only if UsageStats+Overlay proves insufficient on some devices.  
  - **`ACCESS_NOTIFICATION_POLICY`**: to silence notifications (optional; guide user to grant).  

We must handle permission refusals gracefully (graying out “Strict Mode” etc). Battery: a background service with moderate polling (e.g. check every 1s or listen to broadcast ACTION_SCREEN_ON) is needed; in standby it’s low usage. The main UX tradeoff is user trust: too many permissions might turn users off. So by default, do simple mode: a motivational timer that merely discourages quitting (e.g. disables back button during session and shows “Stay Focused!” overlay if left). Advanced blocking can be optional in Settings (“Strict Mode: no quitting”).  

**Play Store Policy:** Google requires that we clearly disclose sensitive permissions. In the app’s description and onboarding, we should state: *“AccessibilityService used only to restrict apps during focus sessions; UsageStats used only to detect app usage. No personal info is collected or sent.”* This satisfies the “prominent disclosure” for Accessibility and usage data. Avoid any claim to automatic social messaging (WhatsApp API use is prohibited).  

# Privacy & Consent Wording  

- **In-app Disclosure:** As soon as we request Usage Access or Accessibility, show a dialog: *“Scrolln't needs special permission to lock distracting apps while you focus. We **do not** collect your personal data or share anything. Tap Allow to continue.”* This matches guidelines.  
- **Play Listing Disclosure:** In the Play Store description add a sentence: *“Uses Android’s Accessibility Service only to detect distracting apps during focus sessions – no data is collected or transmitted.”*  
- **Consent Flow:** For DND: *“Enable Do Not Disturb to silence notifications during focus. No notifications will disturb you, but you can exit DND anytime.”*  
- **Email (Share) Invitation Text:** We can include a templated message like: *“I’m on a 3-day focus streak with Scrolln't 💪. Lock out distractions and join me!”* which the user can copy-share.  

# Tech Stack & Data Storage  

- **Frontend:** **React Native** with Expo – quick to prototype on Android. Use [React Navigation] for screen nav. UI components (buttons, cards) can use basic View/Text or a library like React Native Paper for dark theme.  
- **Local Data:** **AsyncStorage** or **SQLite** for session logs. Schema example (pseudo-SQLite):  

  ```
  Sessions: (id INTEGER, date TEXT, duration INT, completed BOOL)
  Stats: (currentStreak INT, bestStreak INT, totalXP INT)
  Squads: (code TEXT, name TEXT, memberIDs TEXT)
  ```  

  - When a session ends, insert a row with date and success/failure. Streak logic lives in app state (on new day check if previous day had a session, else reset).  
  - Use AsyncStorage for simple key-value (e.g. “stats” JSON).  

- **Backend (optional):** For MVP we can go **offline-first**, i.e. no server. Squads can be handled by sharing codes peer-to-peer (if all on same Wi-Fi, or skip real-time sync). If later needed, a minimal Node/Express server (or Firebase Realtime DB) could manage invites: e.g. POST `/createSquad`, `/joinSquad`, but **no paid APIs** – server cost should fit free tier.  

- **Offline-First:** All core features work without network. Achievements and stats are all local. Only “invite link” uses the OS share sheet.  

- **Analytics:** Use a lightweight local analytics (e.g. console.log for MVP) or free tier of Google/Firebase Analytics. Track events: *SessionStarted, SessionEnded(success/fail), StreakMilestone, SquadCreated, SquadCompleted, InviteShared, SettingsToggled*. Do **not** collect PII.  

# Analytics & Retention Metrics  

- **Key Events:** *OnboardingCompleted, FocusStarted, FocusEnded, FocusAborted, SessionCompleted, SquadsJoined, SquadSessionStarted, SquadSessionResult.*  
- **Funnels:** Onboarding → First Focus Start → First Focus Complete → Second Day Focus (measure drop-offs).  
- **Retention Targets:** Aim for D1 (~30%), D7 (~10%) retention of users returning. (Health app benchmarks: >20% D1 is good for a utility). Track rolling cohorts.  
- **Engagement:** Daily Active Users (DAU) vs Monthly (MAU) → make social features to push DAU.  
- **Goal:** If a user completes ≥3 sessions per week, they’re “hooked.”  

Data should be stored on device (or anonymized in analytics) only. No login required lowers friction.  

# Growth Hooks & Onboarding  

- **Viral Mechanics:** The “Squad” feature is inherently viral – users must invite friends to participate. After each session, prompt: *“Challenge a friend! Share your new 3-day streak.”* with a quick-share dialog.  
- **WhatsApp/Telegram Shareables:** Provide ready-made stickers or text (e.g. “I just locked in for 30m focus with Scrolln't, and won! Bet you can’t beat my streak 👀”).  
- **Onboarding:** Show “Set a focus goal and invite mates” early. Use minimal fields; skip sign-up. Highlight “Start without friends” vs “Start with squad” as two big buttons.  
- **Campus Ambassadors:** Day1/day0: run a “#ScrollKeepers” challenge – promote via Discord/Reddit/influencers. Our marketing plan (extrapolating): 10 launch ideas might include: 
  1. **WhatsApp chain:** Give users an incentive (badge) if they refer 3 friends.  
  2. **Campus flyers/memes:** QR code to download + witty tagline.  
  3. **Social media challenge:** E.g. TikTok: show #NoSwipeChallenge.  
  4. **Beta testers (family/friends):** Get initial 20-30 active users and testimonials.  
  5. **Tech blogs or Indian media:** Light pieces on “New Indian apps beat doomscrolling” (if we have local angle).  
  6. **App Store optimization:** Use keywords “focus, Do Not Disturb, squad, XP” and an eye-catching icon (moai + neon).  
  7. **Discord/Gaming Forums:** Many gamers want focus triggers.  
  8. **In-app referrals:** E.g. “Your friend John is 5 days into a streak! Invite him to squad.”  
  9. **Web landing page + waitlist:** Already mentioned, collect emails from day 0 with “Be first on Scrolln't” sign-up.  
  10. **Limited edition skins:** Gamify further by offering a custom dark theme or mascot that unlocks when your squad reaches a milestone.  

- **Onboarding Checklist:** Keep it under 5 screens. Show progress indicators. Immediately ask only necessary permissions (“Usage Access for blocks”). Avoid overload: do *not* require email or login.  

# Monetization & Unit Economics  

- **Free-First Model:** All core features are free. Value comes from virality, not paywalls.  
- **Potential Premium Features:** (Given low cost to serve, these can be light.) Example: 
  - **“Pro Skins”** – Custom backgrounds or mascots (₹99/year).  
  - **“Family Mode”** – Unlock parental padlock (₹199 one-time), mainly for monetizing parents.  
  - **“Unlimited Squads/Events”** – If we impose a small limit on free squads, pro lifts it.  
  - **“No Ads”** – If any ad or sponsorship planned (though not in MVP).  
- **Pricing:** If needed, small in-app purchase (INR ~₹150/year). But focus on growth first.  
- **Costs:** Minimal. No server means essentially zero ongoing cloud cost. Analytics can be free-tier. No paid APIs avoids costs.  
- **Unit Economics:** For every user: zero incremental cost. If reaching 100k users, revenue can come later through any of above with low support overhead.  

# Testing & QA Checklist (48‑hour MVP)  

- **Sanity Checks:** Install APK on multiple Android versions (11–14). Ensure all buttons navigate correctly.  
- **Functional Tests:** 
  - Start/Stop timer works as expected. 
  - Streak increments only on full completion.
  - Ending early resets streak.
  - Stats screen updates after sessions.
  - App-block overlay appears when allowed (test with a “mock” block list of e.g. Settings app).
  - Squad code creation/join (basic flow simulated, even without backend).
  - Permissions flow: If user denies UsageAccess, show instructions.
- **UX Testing:** 
  - Verify all microcopy for typos & clarity.
  - Confirm dark theme looks coherent (readability).
  - Check localization: English (en-IN) strings sound natural (“jarur” vs “dude”, etc.).  
- **Play Store Checklist:** 
  - Privacy policy link included (even if “All data local”).
  - Correct content rating, category (Productivity).
  - Prominent Disclosure in description. 
  - No forbidden permissions (unless declared properly).  
- **Beta Test:** Quick feedback from 5–10 real users (friends/family). Observe them: does onboarding confuse them? Do they understand squads?  
- **Automated Testing:** Write unit tests or simple integration tests (if time): for example, use Jest to test that `calculateStreak()` logic works given a sequence of session records. Or write a small test for the focus timer logic.  
- **Edge Cases:** 
  - What if user changes time mid-session?
  - Switching away/back (should pause or fail? Decide and test). 
  - What if device sleeps? (Use `keepScreenOn` flag.)
- **Security:** If using any APIs or storing any device identifiers, ensure they’re private. (Likely none.)  
- **Performance:** Timer accuracy, no major battery drain in the short test.  

# Competitors & Feature Comparison  

| **App**               | **Downloads/Rating**       | **Focus Timer** | **App Blocking** | **Stats/Reports** | **Social/Gamification** | **Unique**                                    | **Citations**                    |
|-----------------------|----------------------------|:---------------:|:----------------:|:-----------------:|:-----------------------:|-----------------------------------------------|----------------------------------|
| **Forest**            | 10M+, 4.5★ | ✔ Pomodoro (plant trees) | ✔ (allowlist via Accessibility) | ✔ History (visual forest map) | ✔ Co‑focus (block together; real trees) | Endangered tree planting; currency for real trees | |
| **Opal**              | 500K+, 4.3★ | ✔ Pomodoro, schedules | ✔ (Usage/A11y) | ✔ Weekly reports | ✘ (no friend feature) | Privacy-focused, local-only data | |
| **StayFree**          | 10M+, 4.6★ | ⏸ Some timers | ✔ Optional block | ✔ Cross‑device usage stats | ✘ | Free, cross-platform stats (Win/Mac/Chrome) | |
| **OneSec**            | 1M+, 4.7★ | ❌ (delay screen opener) | ✔ (imposes delay via Accessibility) | ✘ | ✘ | Science-backed 1–3s delay & “holy grail for ADHD” | |
| **Beave (Aktar)**     | ~500+, 5.0★ | ✔ Pomodoro & flip mode | ✔ (Usage+overlay) | ✔ Charts, heatmaps | ✔ Build dams, global map | Hybrid focus+task manager; face-down start | |
| **Stay Focused**      | 5M+, 4.5★ | ✔ Pomodoro | ✔ (Device admin + A11y) | ✔ Usage limits, alarms | ✘ | Very strict (“Strict Mode” no override); blocks sites/Shorts | |
| **Scrolln't (us)**    | –                          | ✔ Pomodoro & face-down | ✔ (UsageStats + overlay) | ✔ Local stats | ✔ Hilarious alerts, Squads PvP | Focus on youth: meme UX, squads |  

Scrolln't **fills gaps**: it adds social PvP (“Squads”) and humor, unlike these (only Forest/Beave had any friend focus, and they’re heavy apps). We emphasize minimal UI and offline-first design.  

# Risks & Mitigations  

- **Android Blocking Limitations:** Some devices kill background services. Mitigate by testing on many models. If UsageStats is unreliable, consider small-time “Accessibility shake” as fallback.  
- **Permission Friction:** Too many requested permissions (Usage, Overlay, Accessibility) may scare users. Mitigation: request **Usage Access** only when first needed, and provide charming rationale dialogs. Keep Accessibility optional (“Strict Mode”) and clearly optional.  
- **Play Store Rejection (Accessibility):** Mitigation: follow policy exactly. Include disclosures in-app and in listing.  Provide a prominent consent prompt as per [32].  
- **User Drop-off:** Many apps suffer drop-off after install. Combat by making the “first session” instantly rewarding (confetti animation, witty message) and encouraging sharing. Keep the UI extremely simple so that new users have success in <2 min.  
- **Feature Creep (UX):** Risk of adding too many features early. Mitigation: Strict MVP scope (only core flows). Resist “fun idea du-jour” until stable.  
- **Technical Debt in 48h:** Code may be messy; plan to refactor ASAP (maybe using GPT-based refactoring).  
- **Competition:** Well-funded blockers (Forest) exist. Our edge is focus on **community + style**. Emphasize uniqueness in marketing.  

---

**GPT/Gemini Micro-Prompts for Next Steps:**  
- PRD Prompt (GPT):  
  > “Create a Product Requirements Document for **Scrolln't** – a gamified focus app. Cover user personas, core features, success metrics, and MVP scope as defined above.”  

- Code Stub Prompt (Gemini):  
  > “Generate a React Native Expo code stub for **Scrolln't** Home screen with a countdown timer, Start/Stop buttons, and a streak display. Use dark theme and placeholder functions for permissions.”  

- Android Accessibility Prompt (GPT):  
  > “Show example Kotlin code for an Android AccessibilityService that listens for opening a specific app (e.g. Instagram) and, when detected, sends the HOME action or shows an overlay.”  

- Unit Test / QA Prompt (GPT):  
  > “Write Jest unit tests for the `calculateStreak(sessions)` function in Scrolln't, including cases for consecutive days, a break day, and empty input.”  

- QA Scenario Prompt (Gemini):  
  > “As QA, list test cases for Scrolln't where the user denies the Usage Access permission or tries to start multiple focus sessions.”  

By following this plan and iterating on real user feedback, the 48-hour MVP of Scrolln't can launch rapidly and reach users. Continuous refinement (with tools like GPT/Gemini aiding coding and UX critique) will take it from a simple focus timer to a sticky, fun habit-builder. 🚀