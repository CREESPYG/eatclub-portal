export const MAIN_ADMIN_EMAIL = 'pooja8.box8@gmail.com';

export const SIGNUP_ROLES = [
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
  'Custom',
];

/**
 * Check if a user has admin privileges.
 * Accepts either:
 *   - A user object with { isAdmin, email } fields
 *   - A role string (backward compat)
 */
export function isAdminRole(user) {
  if (typeof user === 'object' && user !== null) {
    return user.isAdmin === true || user.email === MAIN_ADMIN_EMAIL;
  }
  return false;
}

export function isMainAdmin(email) {
  return email === MAIN_ADMIN_EMAIL;
}

export function isRestrictedRole(role) {
  return role === 'Admin' || role === 'Super Admin';
}
