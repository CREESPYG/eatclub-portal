# Memory Dump & System Context

**Date:** May 14, 2026
**Project:** EatClub Training Portal

## Recent Changes & Implemented Features

### 1. Online Presence System
- **Fix:** Removed `visibilitychange` event listener from `App.jsx` that was setting users to 'idle' when the browser tab was hidden.
- **Result:** Users now show strictly as "Online" for as long as their browser tab remains open. The Firebase `onDisconnect` hook will correctly mark them offline when the tab is fully closed or internet connection is lost.

### 2. Chat Feature Architecture
- **Issue:** User-to-User chat status wasn't updating properly. `DirectChat.jsx` was checking a static `metadata.participants` object instead of the real-time `presence` node.
- **Fix:** Refactored `DirectChat.jsx` to mount a live `onValue` listener directly against `presence/${otherUser.id}`. The UI now dynamically reflects true online status in direct messages.

### 3. Split Chat Interface (Team vs. Direct)
- **UI Upgrade:** Redesigned the main Chat Panel in `App.jsx` to feature a seamless tabbed interface.
- **Team Chat (Tab 1):** 
  - Functions as a global chat room for all agents.
  - Automatically filters messages on load: only messages sent within the **last 24 hours** are visible, maintaining a clean slate every day.
  - Added a **Pin Feature**: Users can click the push-pin icon on any Team Chat message. Pinned messages bypass the 24-hour wipe filter and are saved permanently to the board.
- **Direct Messages (Tab 2):** 
  - Now displays an active inbox list of all one-on-one user conversations.
  - Integrates the `listenUserConversations` service to show the last message preview, activity timestamp, and unread badge counts.
  - Clicking a conversation seamlessly opens the `DirectChat.jsx` component, which inherently saves messages permanently to the `conversations/` database node.

### 4. Database Rebuild
- Successfully executed a manual `wipe_db.js` root reset, clearing all legacy test data across notes, chat, and leaderboards. 
- The Firebase NoSQL structure has begun seamlessly rebuilding itself as new connections initiate.

## Recovery Notes
- The chat architecture uses `App.jsx` for the overlay shell and global state management (`chatTab`, `userConversations`, `chatMessages`).
- The `src/services/messaging.js` handles the core DB logic, separating `chats` (Team) from `conversations` (DMs).
- `pinTeamMessage` function adds a simple `pinned: true/false` boolean to nodes in the `chats/` path.
