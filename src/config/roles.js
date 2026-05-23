export const MAIN_ADMIN_EMAILS = ['pooja8.box8@gmail.com', 'aarif.box8@gmail.com'];
export const MAIN_ADMIN_EMAIL = MAIN_ADMIN_EMAILS[0];

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
    return user.isAdmin === true || MAIN_ADMIN_EMAILS.includes(user.email);
  }
  return false;
}

export function isMainAdmin(email) {
  return MAIN_ADMIN_EMAILS.includes(email);
}

export function isRestrictedRole(role) {
  return role === 'Admin' || role === 'Super Admin';
}
