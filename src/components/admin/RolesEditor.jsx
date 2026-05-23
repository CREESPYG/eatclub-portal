import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { ref as dbRef, onValue, update, remove } from 'firebase/database';

const ALL_PERMISSIONS = [
  { id: 'users.view', label: 'View Users', group: 'Users' },
  { id: 'users.edit', label: 'Edit Users', group: 'Users' },
  { id: 'users.delete', label: 'Delete Users', group: 'Users' },
  { id: 'users.manageRoles', label: 'Manage User Roles', group: 'Users' },
  { id: 'notices.create', label: 'Create Notices', group: 'Notices' },
  { id: 'notices.edit', label: 'Edit Notices', group: 'Notices' },
  { id: 'notices.delete', label: 'Delete Notices', group: 'Notices' },
  { id: 'notices.push', label: 'Send Push Notifications', group: 'Notices' },
  { id: 'content.create', label: 'Create Content', group: 'Content' },
  { id: 'content.edit', label: 'Edit Content', group: 'Content' },
  { id: 'content.delete', label: 'Delete Content', group: 'Content' },
  { id: 'analytics.view', label: 'View Analytics', group: 'Analytics' },
  { id: 'adminLog.view', label: 'View Activity Log', group: 'Admin' },
  { id: 'roles.edit', label: 'Edit Roles & Permissions', group: 'Admin' },
  { id: 'settings.edit', label: 'Edit System Settings', group: 'Admin' },
];

const PERMISSION_GROUPS = [...new Set(ALL_PERMISSIONS.map((p) => p.group))];

const DEFAULT_ROLES_CONFIG = {
  'Super Admin': Object.fromEntries(ALL_PERMISSIONS.map((p) => [p.id, true])),
  'Admin': Object.fromEntries(ALL_PERMISSIONS.map((p) => [p.id, true])),
  'Operations Manager': {
    'users.view': true, 'users.edit': false, 'users.delete': false, 'users.manageRoles': true,
    'notices.create': true, 'notices.edit': true, 'notices.delete': true, 'notices.push': true,
    'content.create': true, 'content.edit': true, 'content.delete': false,
    'analytics.view': true, 'adminLog.view': true, 'roles.edit': false, 'settings.edit': false,
  },
  'Team Lead': {
    'users.view': true, 'users.edit': false, 'users.delete': false, 'users.manageRoles': false,
    'notices.create': true, 'notices.edit': true, 'notices.delete': false, 'notices.push': false,
    'content.create': false, 'content.edit': false, 'content.delete': false,
    'analytics.view': true, 'adminLog.view': false, 'roles.edit': false, 'settings.edit': false,
  },
  'Quality Analyst': {
    'users.view': true, 'users.edit': false, 'users.delete': false, 'users.manageRoles': false,
    'notices.create': false, 'notices.edit': false, 'notices.delete': false, 'notices.push': false,
    'content.create': false, 'content.edit': false, 'content.delete': false,
    'analytics.view': true, 'adminLog.view': false, 'roles.edit': false, 'settings.edit': false,
  },
  'Trainer': {
    'users.view': true, 'users.edit': false, 'users.delete': false, 'users.manageRoles': false,
    'notices.create': true, 'notices.edit': true, 'notices.delete': false, 'notices.push': false,
    'content.create': true, 'content.edit': true, 'content.delete': false,
    'analytics.view': true, 'adminLog.view': false, 'roles.edit': false, 'settings.edit': false,
  },
  'Member': {
    'users.view': true, 'users.edit': false, 'users.delete': false, 'users.manageRoles': false,
    'notices.create': false, 'notices.edit': false, 'notices.delete': false, 'notices.push': false,
    'content.create': false, 'content.edit': false, 'content.delete': false,
    'analytics.view': false, 'adminLog.view': false, 'roles.edit': false, 'settings.edit': false,
  },
};

export default function RolesEditor({ user, onLog }) {
  const [roles, setRoles] = useState({});
  const [editingRole, setEditingRole] = useState(null);
  const [editedPerms, setEditedPerms] = useState({});
  const [newRoleName, setNewRoleName] = useState('');
  const [toast, setToast] = useState(null);

  const userEmail = user?.email || localStorage.getItem('eatclub_agent_email') || '';

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const ref = dbRef(db, 'roles');
    const unsub = onValue(ref, (snap) => {
      const data = snap.val();
      if (data) {
        setRoles(data);
      } else {
        // Seed default roles on first load
        Object.entries(DEFAULT_ROLES_CONFIG).forEach(([roleName, perms]) => {
          update(dbRef(db, 'roles/' + roleName), perms).catch(() => {});
        });
        setRoles(DEFAULT_ROLES_CONFIG);
      }
    });
    return () => unsub();
  }, []);

  function startEdit(roleName) {
    setEditingRole(roleName);
    setEditedPerms({ ...(roles[roleName] || {}) });
  }

  function togglePerm(permId) {
    setEditedPerms((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  }

  function setAllPerms(value) {
    const updated = {};
    ALL_PERMISSIONS.forEach((p) => {
      updated[p.id] = value;
    });
    setEditedPerms(updated);
  }

  function saveRole() {
    if (!editingRole) return;
    update(dbRef(db, 'roles/' + editingRole), editedPerms).then(() => {
      showToast('Permissions saved for ' + editingRole);
      if (onLog) {
        onLog({
          action: 'role.permissions.update',
          targetType: 'role',
          targetId: editingRole,
          details: { permissions: editedPerms },
          description: 'Updated permissions for ' + editingRole,
        });
      }
      setEditingRole(null);
    }).catch((err) => {
      showToast('Error: ' + err.message);
    });
  }

  function addRole() {
    const name = newRoleName.trim();
    if (!name) return;
    if (roles[name]) {
      showToast('Role already exists.');
      return;
    }
    const defaultPerms = Object.fromEntries(ALL_PERMISSIONS.map((p) => [p.id, false]));
    update(dbRef(db, 'roles/' + name), defaultPerms).then(() => {
      showToast('Role "' + name + '" created.');
      setNewRoleName('');
    });
  }

  function deleteRole(roleName) {
    if (DEFAULT_ROLES_CONFIG[roleName]) {
      showToast('Cannot delete default roles.');
      return;
    }
    if (!confirm('Delete role "' + roleName + '" permanently?')) return;
    remove(dbRef(db, 'roles/' + roleName)).then(() => {
      showToast('Role "' + roleName + '" deleted.');
      if (onLog) {
        onLog({
          action: 'role.delete',
          targetType: 'role',
          targetId: roleName,
          details: {},
          description: 'Deleted role ' + roleName,
        });
      }
    });
  }

  const roleNames = Object.keys(roles).sort();

  return (
    <div>
      <div className="admin-flex-row" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--md-on-surface)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--md-primary)', fontSize: 18 }}>admin_panel_settings</span>
          Roles & Permissions
          <span className="admin-badge" style={{ background: 'rgba(var(--md-primary-rgb), 0.08)', color: 'var(--md-primary)', fontSize: 10 }}>
            {roleNames.length} roles
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="admin-input"
            style={{ width: 160 }}
            placeholder="New role name..."
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            aria-label="New role name"
            onKeyDown={(e) => { if (e.key === 'Enter') addRole(); }}
          />
          <button className="admin-btn admin-btn-primary" onClick={addRole}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
            Add Role
          </button>
        </div>
      </div>

      <div className="admin-section" style={{ padding: 0, overflow: 'hidden' }}>
        {roleNames.length === 0 ? (
          <div className="admin-empty-state">No roles configured yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 0 }}>
            {roleNames.map((roleName) => {
              const perms = roles[roleName] || {};
              const permCount = Object.values(perms).filter(Boolean).length;
              const isDefault = !!DEFAULT_ROLES_CONFIG[roleName];
              const isEditing = editingRole === roleName;

              return (
                <div
                  key={roleName}
                  style={{
                    borderRight: '1px solid var(--md-outline)',
                    borderBottom: '1px solid var(--md-outline)',
                    padding: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--md-on-surface)' }}>{roleName}</span>
                      <span className="admin-badge" style={{ marginLeft: 8, background: 'rgba(var(--md-primary-rgb), 0.06)', color: 'var(--md-primary)', fontSize: 9 }}>
                        {permCount}/{ALL_PERMISSIONS.length} perms
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '2px 8px', fontSize: 10 }}
                        onClick={() => startEdit(roleName)}
                        aria-label={'Edit ' + roleName + ' permissions'}
                      >
                        {isEditing ? 'Editing...' : 'Edit'}
                      </button>
                      {!isDefault && (
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '2px 8px', fontSize: 10 }}
                          onClick={() => deleteRole(roleName)}
                          aria-label={'Delete ' + roleName}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <button className="admin-btn admin-btn-outline" style={{ padding: '2px 10px', fontSize: 10 }} onClick={() => setAllPerms(true)}>All On</button>
                        <button className="admin-btn admin-btn-outline" style={{ padding: '2px 10px', fontSize: 10 }} onClick={() => setAllPerms(false)}>All Off</button>
                      </div>
                      {PERMISSION_GROUPS.map((group) => (
                        <div key={group} style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--md-on-surface-var)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>
                            {group}
                          </div>
                          {ALL_PERMISSIONS.filter((p) => p.group === group).map((perm) => (
                            <label
                              key={perm.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '4px 6px',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--md-on-surface)',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!!editedPerms[perm.id]}
                                onChange={() => togglePerm(perm.id)}
                                style={{ accentColor: 'var(--md-primary)' }}
                              />
                              {perm.label}
                            </label>
                          ))}
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button className="admin-btn admin-btn-primary" style={{ flex: 1 }} onClick={saveRole}>Save</button>
                        <button className="admin-btn admin-btn-outline" onClick={() => setEditingRole(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && <div className="admin-toast" role="alert">{toast}</div>}
    </div>
  );
}
