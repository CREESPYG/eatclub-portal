# API Contract — User & Role Management

## Overview
All endpoints use **Firebase Realtime Database** (REST-compatible via Firebase SDK). Authentication is handled via Firebase Auth (Google Sign-In). The database URL is `https://quickchat-87c9f-default-rtdb.firebaseio.com`.

---

## 1. List All Users

**Endpoint:** `GET /users.json`
**Auth:** Firebase Auth token required (any authenticated user)

**Response (200):**
```json
{
  "<uid>": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Chat Executive",
    "bio": "Team lead for chat ops",
    "photoURL": "https://...",
    "lastLogin": 1716000000000
  }
}
```

**Notes:**
- Returns all registered users as a map keyed by Firebase Auth UID
- `role` may be absent (defaults to `"Member"` on the frontend)
- Frontend reads this path via `onValue(dbRef(db, 'users'))`

---

## 2. Update User Role

**Endpoint:** `PATCH /users/{uid}.json`
**Auth:** Firebase Auth token required
**Required fields:** `role` (string)

**Request body:**
```json
{
  "role": "Admin"
}
```

**Response (200):**
```json
{
  "role": "Admin"
}
```

**Validation rules:**
| Condition | Behavior |
|-----------|----------|
| Target user is `pooja8.box8@gmail.com` (main admin) | Write is **rejected** by security rules and frontend guard |
| Role value is `"Admin"` or `"Super Admin"` AND writer is the target user themself | Write is **rejected** by security rule `.validate` — users cannot self-promote |
| Authenticated user is the target user themself | Write **allowed** for non-restricted roles only |
| Any other user | Write **allowed** for any authenticated user (admin-only enforced at frontend) |

**Frontend guard** (`UserManagement.jsx`):
- `handleRoleChange` returns early with toast `"Cannot change role of the main admin"` if the target is the main admin.
- `handleMakeAdmin` returns early with toast if attempting to revoke main admin.

**Frontend guard** (`ProfileSetup.jsx`, `UserDashboard.jsx`):
- `handleSave` / `handleSaveProfile` checks `isRestrictedRole(role)` and rejects with error: `"Admin and Super Admin roles cannot be self-assigned. Contact your administrator."`
- Role dropdowns use `SIGNUP_ROLES` which excludes `Admin` and `Super Admin`.

**Backend security rule** (`firebase-database.rules.json`):
```json
"users": {
  "$uid": {
    ".write": "auth.uid !== null && ($uid === auth.uid || ...)",
    "role": {
      ".write": "auth.uid !== null && ($uid === auth.uid || ...)",
      ".validate": "($uid !== auth.uid) || (newData.val() !== 'Admin' && newData.val() !== 'Super Admin')"
    }
  }
}
```

---

## 3. Fetch Current User's Role

**Option A — Direct DB read:**
**Endpoint:** `GET /users/{uid}/role.json`
**Auth:** Firebase Auth token required

**Response (200):**
```json
"Admin"
```

**Option B — Frontend state (App.jsx):**
- On login, role is read from `users/{uid}/role` via `onValue` listener
- Falls back to `localStorage.getItem('eatclub_role')`
- Special case: `pooja8.box8@gmail.com` is auto-assigned `"Admin"` if no role exists

---

## 4. Seed Data

### Main Admin
```json
{
  "users": {
    "<uid>": {
      "name": "Pooja",
      "email": "pooja8.box8@gmail.com",
      "role": "Admin",
      "lastLogin": 1716000000000
    }
  }
}
```

### Non-Admin User (example)
```json
{
  "users": {
    "<uid>": {
      "name": "Jane Agent",
      "email": "jane@example.com",
      "role": "Member",
      "lastLogin": 1715900000000
    }
  }
}
```

**Seeding logic** (in `App.jsx`):
- On Google login, if `email === 'pooja8.box8@gmail.com'`, role is auto-set to `"Admin"`
- For all other users, role is whatever was previously stored (or empty)
- Realtime listener re-seeds the main admin role on every connection if missing

---

## 5. Role Restrictions

### Roles allowed in self-service sign-up / profile edit
`Chat Executive`, `Senior Chat Executive`, `Email Support Agent`, `Call Support Agent`, `Team Lead`, `Quality Analyst`, `Operations Manager`, `Trainer`, `Developer`, `Customer Support Specialist`, `Escalation Specialist`, `Custom`

### Roles that can ONLY be assigned by an admin
`Admin`, `Super Admin`

These restricted roles are excluded from `SignupRoles` and `UserDashboard` role dropdowns. Attempting to set them via self-service triggers a validation error and is rejected.

### Migration for existing Admin/Super Admin non-main-admin users
When a user who previously had `Admin` or `Super Admin` (but is not `pooja8.box8@gmail.com`) visits their profile edit screen:
1. The dropdown no longer offers `Admin` or `Super Admin` options
2. Their current role is displayed but cannot be changed to a restricted role
3. If they save their profile with a different role, the restricted role is replaced
4. No automatic mass migration — users keep their role until changed by an admin or voluntarily updated
