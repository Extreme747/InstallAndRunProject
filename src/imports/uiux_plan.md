# Scrolln't — Complete Interactive Navigation Map & Routing Matrix

This document provides the exhaustive **Screen Connection & Interaction Map** for all **38 screens** in Scrolln't. It details every button, card, icon, tab, and system event trigger that links one screen to another.

---

## 1. Primary App Shell & Bottom Navigation Tabs

The app uses a 4-tab Bottom Navigation bar present on primary screens:

```
[ 🏠 HOME ]    [ 🎯 FOCUS ]    [ 📊 STATS ]    [ ⚙️ SETTINGS ]
```

- **Tab 1: Home (`home`)**: Main focus launcher, duration selector, and feature hubs.
- **Tab 2: Focus (`focus`)**: Active countdown session and lock-in state.
- **Tab 3: Stats (`stats`)**: Performance analytics, streak metrics, and insights.
- **Tab 4: Settings (`settings`)**: Preferences, notifications, mascot skins, and Pro upgrade.

---

## 2. Exhaustive Screen-to-Screen Connection Map (38 Screens)

### A. Onboarding & Permissions Flow
```
[splash] ──(Auto-advance)──> [onboarding-1]
                                 │
                               (Next)
                                 ▼
                             [onboarding-2]
                                 │
                               (Next)
                                 ▼
                             [onboarding-3]
                                 │
                          (Grant Permissions)
                                 ▼
                           [permission-usage]
                                 │
                            (Continue)
                                 ▼
                          [permission-overlay]
                                 │
                            (Continue)
                                 ▼
                      [permission-accessibility]
                                 │
                             (Finish)
                                 ▼
                              [home]
```

1. **Splash (`splash`)**:
   - `Auto-timer (1.5s)` -> Advances to `onboarding-1` (if first launch) or `home` (if onboarded).
2. **Onboarding 1 (`onboarding-1`)**:
   - `Next →` CTA -> `onboarding-2`
   - `Skip` Button -> `home`
3. **Onboarding 2 (`onboarding-2`)**:
   - `Next →` CTA -> `onboarding-3`
   - `Skip` Button -> `home`
4. **Onboarding 3 (`onboarding-3`)**:
   - `Grant Permissions` CTA -> `permission-usage`
5. **Usage Access (`permission-usage`)**:
   - `Grant Access` -> Opens Android Settings
   - `Continue →` CTA -> `permission-overlay`
6. **Overlay Permission (`permission-overlay`)**:
   - `Grant Overlay` -> Opens Android Settings
   - `Continue →` CTA -> `permission-accessibility`
7. **Accessibility / Hardcore Permission (`permission-accessibility`)**:
   - `Finish Setup` CTA -> `home`

---

### B. Core Screens & Focus Flow
```
                   ┌────────────────────────────────────────┐
                   │                 [home]                 │
                   └───────────────────┬────────────────────┘
                                       │
                              ("LOCK IN NOW" CTA)
                                       ▼
                            ┌──────────────────────┐
                            │       [focus]        │
                            └──────────┬───────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             │                         │                         │
     (App Switch Event)        ("Give Up" Button)        (Timer Hits 00:00)
             │                         │                         │
             ▼                         ▼                         ▼
      [block-overlay]              [error]                   [success]
             │                         │                         │
     (Return to Focus)           (Return)                  (Claim XP)
             │                         │                         │
             └─────────────────────────┼─────────────────────────┘
                                       ▼
                                    [home]
```

8. **Home (`home`)**:
   - `Top Profile / Mascot Avatar` -> `settings`
   - `Streak Badge / XP Chip` -> `xp-dashboard`
   - `Time Chips (15m, 25m, 45m, 60m)` -> Selects duration
   - `Solo vs Squad Toggle` -> Switches session mode
   - `LOCK IN NOW` CTA -> `focus`
   - `Challenges Hub Card` -> `daily-challenges`
   - `Squads Hub Card` -> `squad-dashboard`
   - `Store Hub Card` -> `theme-store`
   - `Analytics Hub Card` -> `deep-analytics`

9. **Focus Session (`focus`)**:
   - `Distractions Badge` -> `distraction-report`
   - `Opening Blocked App (Insta/TikTok)` -> Triggers `block-overlay`
   - `GIVE UP (Lose Streak)` CTA -> `error` (Aborted Session)
   - `Timer Reaches 00:00` -> `success` (Session Completed)

10. **Block Overlay (`block-overlay`)**:
    - `RETURN TO FOCUS` CTA -> Returns to active `focus`
    - `EMERGENCY EXIT (-50 XP)` CTA -> `error` / `home`

11. **Stats (`stats`)**:
    - `Milestones / Badges Banner` -> `milestones`
    - `View Full Heatmap` CTA -> `heatmap`
    - `Focus Insights Card` -> `focus-insights`
    - `Distraction Breakdown Card` -> `distraction-report`
    - `Session History Link` -> `session-history`

---

### C. Challenges & Missions Flow
12. **Daily Challenges (`daily-challenges`)**:
    - `Weekly Missions Tab` -> `weekly-missions`
    - `Special Events Tab` -> `focus-challenges`
    - `Claim Reward` CTA -> `success-challenge`
13. **Weekly Missions (`weekly-missions`)**:
    - `Daily Challenges Tab` -> `daily-challenges`
    - `Claim Tier Reward` CTA -> `success-challenge`
14. **Focus Challenges (`focus-challenges`)**:
    - `Join Event` CTA -> Enrolls user & returns to `home`

---

### D. Achievements, XP & Aura Flow
15. **Milestones (`milestones`)**:
    - `Category Tabs (All, Streaks, Focus, XP, Social)` -> Filters badges
    - `Unlocked Badge Card` -> `share-achievement`
16. **XP & Aura Dashboard (`xp-dashboard`)**:
    - `Aura Energy Gauge Card` -> `aura-progress`
    - `Milestones Link` -> `milestones`
17. **Aura Progress (`aura-progress`)**:
    - `Back ←` -> `xp-dashboard`

---

### E. Squads & Social Flow
18. **Squad Dashboard (`squad-dashboard`)**:
    - `Leaderboard Tab` -> `squad-leaderboard`
    - `Squad Goals Card` -> `squad-goals`
    - `INVITE FRIENDS` CTA -> `invite-friends`
    - `Streak Shield Card` -> `streak-freeze`
    - `No Squad State` -> `empty-squad`
19. **Squad Leaderboard (`squad-leaderboard`)**:
    - `Share Rank Card` -> `share-cards`
20. **Squad Goals (`squad-goals`)**:
    - `Back ←` -> `squad-dashboard`
21. **Invite Friends (`invite-friends`)**:
    - `Share Squad Code` CTA -> Triggers system share sheet / `share-cards`
22. **Streak Freeze (`streak-freeze`)**:
    - `Buy / Equip Freeze` CTA -> Deducts Aura & equips shield
23. **Share Cards (`share-cards`)**:
    - `Share to Instagram Story / WhatsApp` -> System share
24. **Share Achievement (`share-achievement`)**:
    - `Share Achievement` CTA -> System share

---

### F. Customization & Store Flow
25. **Theme Store (`theme-store`)**:
    - `Mascot Skins Tab` -> `mascot-customization` / `moai-skins`
    - `Sound Packs Tab` -> `sound-packs`
    - `Equip Theme` CTA -> Updates active app theme
    - `Locked Theme` CTA -> `premium-upgrade`
26. **Mascot Customization (`mascot-customization` / `moai-skins`)**:
    - `Equip Mascot Skin` CTA -> Updates active mascot
    - `Locked Skin (Pro)` CTA -> `premium-upgrade`
27. **Sound Packs (`sound-packs`)**:
    - `Preview Sound` -> Plays audio preview
    - `Equip Sound` -> Updates focus ambient audio

---

### G. Analytics & Reports Flow
28. **Deep Analytics (`deep-analytics`)**:
    - `Heatmap Grid Card` -> `heatmap`
    - `Calendar View Tab` -> `calendar-view`
    - `Focus Insights Card` -> `focus-insights`
29. **Heatmap (`heatmap`)**:
    - `Back ←` -> `deep-analytics`
30. **Calendar View (`calendar-view`)**:
    - `Back ←` -> `deep-analytics`
31. **Focus Insights (`focus-insights`)**:
    - `Distraction Breakdown Card` -> `distraction-report`
32. **Distraction Report (`distraction-report`)**:
    - `Back ←` -> `stats`
33. **Session History (`session-history`)**:
    - `Back ←` -> `stats`
34. **Daily Recap (`daily-recap`)**:
    - `Share Day Summary` CTA -> `share-cards`
    - `Close` -> `home`
35. **Weekly Report (`weekly-report`)**:
    - `Share Weekly Report` CTA -> `share-cards`
    - `Close` -> `home`

---

### H. Settings & Monetization Flow
36. **Settings (`settings`)**:
    - `Roast Language Toggle (English / Hinglish)` -> Updates preference
    - `Notifications Settings` -> `notifications-settings`
    - `Android Widgets Preview` -> `widgets-preview`
    - `Permissions Manager` -> `permission-usage`
    - `GO PRO / Upgrade Banner` -> `premium-upgrade`
37. **Notifications Settings (`notifications-settings`)**:
    - `Back ←` -> `settings`
38. **Widgets Preview (`widgets-preview`)**:
    - `Back ←` -> `settings`
39. **Premium Upgrade / Paywall (`premium-upgrade`)**:
    - `UNLOCK PRO` CTA -> Purchase trigger -> `subscription-management`
    - `Manage Subscription` -> `subscription-management`
40. **Subscription Management (`subscription-management`)**:
    - `Manage / Cancel Plan` -> Store billing settings

---

## 3. Summary Routing Matrix Table

| Source Screen | Click Target / Action | Destination Screen |
| :--- | :--- | :--- |
| **`splash`** | Timer Expiry (1.5s) | `onboarding-1` / `home` |
| **`onboarding-1`** | Next Button | `onboarding-2` |
| **`onboarding-2`** | Next Button | `onboarding-3` |
| **`onboarding-3`** | Grant Permissions CTA | `permission-usage` |
| **`permission-usage`** | Continue Button | `permission-overlay` |
| **`permission-overlay`** | Continue Button | `permission-accessibility` |
| **`permission-accessibility`**| Finish Setup | `home` |
| **`home`** | LOCK IN NOW CTA | `focus` |
| **`home`** | Top Mascot Avatar | `settings` |
| **`home`** | Streak / XP Chip | `xp-dashboard` |
| **`home`** | Challenges Card | `daily-challenges` |
| **`home`** | Squads Card | `squad-dashboard` |
| **`home`** | Store Card | `theme-store` |
| **`home`** | Analytics Card | `deep-analytics` |
| **`focus`** | Distractions Badge | `distraction-report` |
| **`focus`** | Open Distracted App | `block-overlay` |
| **`focus`** | Give Up Button | `error` |
| **`focus`** | Timer Hits 00:00 | `success` |
| **`block-overlay`** | RETURN TO FOCUS | `focus` |
| **`block-overlay`** | Emergency Exit | `error` / `home` |
| **`stats`** | Milestones Banner | `milestones` |
| **`stats`** | View Heatmap | `heatmap` |
| **`stats`** | Insights Card | `focus-insights` |
| **`stats`** | Distraction Card | `distraction-report` |
| **`daily-challenges`** | Weekly Missions Tab | `weekly-missions` |
| **`daily-challenges`** | Special Events Tab | `focus-challenges` |
| **`squad-dashboard`** | Leaderboard Tab | `squad-leaderboard` |
| **`squad-dashboard`** | Squad Goals | `squad-goals` |
| **`squad-dashboard`** | Invite Friends | `invite-friends` |
| **`squad-dashboard`** | Streak Freeze | `streak-freeze` |
| **`theme-store`** | Mascot Skins Tab | `mascot-customization` |
| **`theme-store`** | Sound Packs Tab | `sound-packs` |
| **`theme-store`** | Locked Item (Pro) | `premium-upgrade` |
| **`settings`** | GO PRO Banner | `premium-upgrade` |
| **`settings`** | Notifications | `notifications-settings` |
| **`settings`** | Widgets Preview | `widgets-preview` |
| **`premium-upgrade`** | Manage Plan | `subscription-management` |
