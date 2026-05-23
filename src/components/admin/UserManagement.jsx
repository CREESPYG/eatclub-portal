import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue, update, remove } from 'firebase/database';
import { MAIN_ADMIN_EMAIL, MAIN_ADMIN_EMAILS } from '../../config/roles';
import UserAvatar from '../UserAvatar';

const DEFAULT_ROLES = [
  'Member',
  'Chat Executive',
  'Senior Chat Executive',
  'Email Support Agent',
  'Call Support Agent',
  'Team Lead',
  'Quality Analyst',
  'Operations Manager',
  'Trainer',
  'Developer',
  'Customer Support Specialist',
  'Escalation Specialist',
];

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function UserManagement({ user, onLog }) {
  const [allUsers, setAllUsers] = useState([]);
  const [presenceData, setPresenceData] = useState({});
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [toast, setToast] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const dropdownRef = useRef(null);

  const adminUid = user?.uid || localStorage.getItem('eatclub_uid');
  const adminEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';
  const currentUserIsMainAdmin = MAIN_ADMIN_EMAILS.includes(adminEmail);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const usersRef = dbRef(db, 'users');
    const unsubUsers = onValue(usersRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        list.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
        setAllUsers(list);
      }
    });

    const presenceRef = dbRef(db, 'presence');
    const unsubPresence = onValue(presenceRef, (snap) => {
      const data = snap.val();
      if (data) setPresenceData(data);
    });

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setEditingRole(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubUsers();
      unsubPresence();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleRoleChange(uid, newRole, userName) {
    const targetUser = allUsers.find((u) => u.id === uid);
    if (MAIN_ADMIN_EMAILS.includes(targetUser?.email)) {
      showToast('Cannot change role of a main admin account');
      setEditingRole(null);
      return;
    }
    update(dbRef(db, 'users/' + uid), { role: newRole }).catch(() => null);
    update(dbRef(db, 'leaderboard/' + uid), { role: newRole }).catch(() => null);
    setEditingRole(null);
    showToast(userName + ' role updated to ' + newRole);
    if (onLog) {
      onLog({
        action: 'user.role.update',
        targetType: 'user',
        targetId: uid,
        details: { newRole },
        description: 'Changed ' + userName + ' to ' + newRole,
      });
    }
  }

  function handleDeleteUser(uid, userName, userEmail) {
    if (MAIN_ADMIN_EMAILS.includes(userEmail)) {
      showToast('Cannot remove a main admin from the leaderboard');
      return;
    }
    if (!confirm('Remove ' + userName + ' from the leaderboard?')) return;
    remove(dbRef(db, 'leaderboard/' + uid)).catch(() => null);
    showToast(userName + ' removed from leaderboard.');
    if (onLog) {
      onLog({
        action: 'user.delete',
        targetType: 'user',
        targetId: uid,
        details: {},
        description: 'Removed ' + userName + ' from leaderboard',
      });
    }
  }

  function handleAddCustomRole(uid, currentRole) {
    const newRole = prompt('Enter custom role:', currentRole || '');
    if (newRole && newRole !== currentRole) {
      const u = allUsers.find((u) => u.id === uid);
      handleRoleChange(uid, newRole, u?.name || 'User');
    }
  }

  const handleToggleAdmin = (uid, userName, currentlyAdmin) => {
    const targetUser = allUsers.find((u) => u.id === uid);
    if (MAIN_ADMIN_EMAILS.includes(targetUser?.email)) {
      showToast('Cannot change admin status of a main admin account');
      return;
    }
    const newAdminState = !currentlyAdmin;
    update(dbRef(db, 'users/' + uid), { isAdmin: newAdminState }).catch(() => null);
    showToast(newAdminState ? userName + ' granted admin privileges' : userName + ' admin privileges revoked');
    if (onLog) {
      onLog({
        action: 'user.admin.' + (newAdminState ? 'grant' : 'revoke'),
        targetType: 'user',
        targetId: uid,
        details: { isAdmin: newAdminState },
        description: (newAdminState ? 'Granted' : 'Revoked') + ' admin for ' + userName,
      });
    }
  };

  let filtered = allUsers;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((u) =>
      (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    );
  }
  if (filterRole !== 'all') {
    filtered = filtered.filter((u) => (u.role || 'Member') === filterRole);
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'lastLogin') return (b.lastLogin || 0) - (a.lastLogin || 0);
    if (sortBy === 'role') return (a.role || 'Member').localeCompare(b.role || 'Member');
    return 0;
  });

  const roleCounts = {};
  allUsers.forEach((u) => {
    const r = u.role || 'Member';
    roleCounts[r] = (roleCounts[r] || 0) + 1;
  });
  const uniqueRoles = Object.keys(roleCounts).sort();

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--md-on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 18 }}>manage_accounts</span>
        User Management
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--md-on-surface-var)' }}>{allUsers.length} users</span>
      </div>

      <div className="admin-grid-2">
        {[
          { icon: 'group', label: 'Total Users', val: allUsers.length, color: '#2196F3' },
          { icon: 'wifi', label: 'Online Now', val: Object.values(presenceData).filter((p) => p.status === 'online').length, color: '#4CAF50' },
          { icon: 'badge', label: 'Roles', val: uniqueRoles.length, color: '#9C27B0' },
          { icon: 'how_to_reg', label: 'Admins', val: allUsers.filter((u) => u.isAdmin === true || MAIN_ADMIN_EMAILS.includes(u.email)).length, color: '#E91E63' },
        ].map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--md-on-surface)', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--md-on-surface-var)', marginTop: 4, fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-section" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <input
              className="admin-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search users"
            />
          </div>
          <select
            className="admin-dropdown"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>{r} ({roleCounts[r]})</option>
            ))}
          </select>
          <select
            className="admin-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by"
          >
            <option value="name">Name</option>
            <option value="lastLogin">Last Login</option>
            <option value="role">Role</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--md-on-surface-var)', fontSize: 12 }}>{search ? 'No users match your search.' : 'No users registered yet.'}</td></tr>
              ) : (
                sorted.map((u) => {
                  const presence = presenceData[u.id] || Object.values(presenceData).find((p) => p.email === u.email);
                  const isOnline = presence?.status === 'online';
                  const isSelf = u.id === adminUid;
                  const isMainAdminUser = MAIN_ADMIN_EMAILS.includes(u.email);
                  const showMakeAdminBtn = currentUserIsMainAdmin && !isSelf;
                  const userIsAdmin = u.isAdmin === true || isMainAdminUser;

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <UserAvatar size={28} name={u.name} photoURL={u.photoURL} />
                          <span style={{ fontWeight: 700, fontSize: 12 }}>
                            {u.name}
                            {isMainAdminUser && (
                              <span style={{ fontSize: 8, background: '#E91E63', color: '#fff', padding: '1px 6px', borderRadius: 6, marginLeft: 6, fontWeight: 800 }}>MAIN ADMIN</span>
                            )}
                            {userIsAdmin && !isMainAdminUser && (
                              <span style={{ fontSize: 8, background: 'var(--md-primary)', color: '#fff', padding: '1px 6px', borderRadius: 6, marginLeft: 6, fontWeight: 800 }}>ADMIN</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--md-on-surface-var)' }}>{u.email}</td>
                      <td ref={editingRole === u.id ? dropdownRef : null}>
                        {editingRole === u.id ? (
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <select
                              className="admin-dropdown"
                              defaultValue={u.role || 'Member'}
                              onChange={(e) => {
                                if (e.target.value === '__custom__') {
                                  handleAddCustomRole(u.id, u.role);
                                } else {
                                  handleRoleChange(u.id, e.target.value, u.name || 'User');
                                }
                              }}
                              autoFocus
                              aria-label="Select role"
                              onBlur={() => setEditingRole(null)}
                            >
                              {DEFAULT_ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                              {u.role && !DEFAULT_ROLES.includes(u.role) && (
                                <option value={u.role}>{u.role}</option>
                              )}
                              <option disabled>---</option>
                              <option value="__custom__">+ Custom...</option>
                            </select>
                            <button
                              onClick={() => setEditingRole(null)}
                              style={{ padding: 4, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--md-on-surface-var)' }}
                              aria-label="Cancel"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className="admin-badge"
                            style={{
                              background: 'rgba(var(--md-primary-rgb), 0.08)',
                              color: 'var(--md-primary)',
                              cursor: 'pointer',
                            }}
                            onClick={() => setEditingRole(u.id)}
                            title="Click to change role"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') setEditingRole(u.id); }}
                            aria-label={'Role: ' + (u.role || 'Member') + '. Click to change'}
                          >
                            {u.role || 'Member'}
                            <span className="material-symbols-outlined" style={{ fontSize: 10, marginLeft: 4, verticalAlign: 'middle' }}>arrow_drop_down</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={'admin-badge ' + (isOnline ? 'online' : 'offline')}>
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--md-on-surface-var)' }}>{u.lastLogin ? formatTime(u.lastLogin) : '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {showMakeAdminBtn && (
                            <button
                              className={'admin-btn ' + (userIsAdmin ? 'admin-btn-outline' : 'admin-btn-primary')}
                              style={{ padding: '4px 10px', fontSize: 10 }}
                              onClick={() => handleToggleAdmin(u.id, u.name || 'User', userIsAdmin)}
                              aria-label={userIsAdmin ? 'Revoke admin from ' + (u.name || 'User') : 'Grant admin to ' + (u.name || 'User')}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 12, marginRight: 2 }}>{userIsAdmin ? 'manage_accounts' : 'shield'}</span>
                              {userIsAdmin ? 'Revoke Admin' : 'Grant Admin'}
                            </button>
                          )}
                          {isMainAdminUser && currentUserIsMainAdmin && (
                            <span
                              style={{
                                padding: '4px 10px', fontSize: 10, borderRadius: 6,
                                background: 'rgba(233,30,99,0.08)', color: '#E91E63',
                                fontWeight: 700, whiteSpace: 'nowrap',
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                              }}
                              title="This is the main admin account and cannot be demoted"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span>
                              Protected
                            </span>
                          )}
                          {isMainAdminUser ? (
                            <span
                              style={{
                                padding: '4px 10px', fontSize: 10, borderRadius: 6,
                                background: 'rgba(158,158,158,0.08)', color: '#9E9E9E',
                                fontWeight: 700, whiteSpace: 'nowrap',
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                cursor: 'not-allowed',
                              }}
                              title="Cannot remove the main admin"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>block</span>
                              Remove
                            </span>
                          ) : (
                            <button
                              className="admin-btn admin-btn-danger"
                              style={{ padding: '4px 10px' }}
                              onClick={() => handleDeleteUser(u.id, u.name || 'User', u.email)}
                              aria-label={'Remove ' + (u.name || 'User') + ' from leaderboard'}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <span className="material-symbols-outlined" style={{ color: 'var(--md-on-surface-var)', fontSize: 16 }}>pie_chart</span>
          Role Distribution
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {uniqueRoles.map((role, i) => {
            const colors = ['#FF5722', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50', '#FF9800', '#00BCD4', '#607D8B'];
            const pct = ((roleCounts[role] / allUsers.length) * 100).toFixed(0);
            return (
              <div key={role} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--md-surface)', border: '1px solid var(--md-outline)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length] }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--md-on-surface)' }}>{role}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--md-on-surface-var)' }}>{roleCounts[role]} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {toast && <div className="admin-toast" role="alert">{toast}</div>}
    </div>
  );
}
