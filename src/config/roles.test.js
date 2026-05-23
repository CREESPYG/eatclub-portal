import { describe, it, expect } from 'vitest';
import {
  MAIN_ADMIN_EMAIL,
  isAdminRole,
  isMainAdmin,
  isRestrictedRole,
  SIGNUP_ROLES,
} from './roles';

describe('roles config', () => {
  it('defines the main admin email', () => {
    expect(MAIN_ADMIN_EMAIL).toBe('pooja8.box8@gmail.com');
  });

  it('identifies the main admin by email', () => {
    expect(isMainAdmin('pooja8.box8@gmail.com')).toBe(true);
    expect(isMainAdmin('other@example.com')).toBe(false);
    expect(isMainAdmin('')).toBe(false);
  });
});

describe('isAdminRole', () => {
  it('returns true for user with isAdmin=true', () => {
    expect(isAdminRole({ isAdmin: true, email: 'user@test.com' })).toBe(true);
  });

  it('returns true for main admin email', () => {
    expect(isAdminRole({ isAdmin: false, email: 'pooja8.box8@gmail.com' })).toBe(true);
  });

  it('returns false for non-admin user', () => {
    expect(isAdminRole({ isAdmin: false, email: 'member@test.com' })).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });
});

describe('isRestrictedRole', () => {
  it('returns false for designations since admin is now separate', () => {
    expect(isRestrictedRole('Member')).toBe(false);
    expect(isRestrictedRole('Chat Executive')).toBe(false);
    expect(isRestrictedRole('Developer')).toBe(false);
    expect(isRestrictedRole('Team Lead')).toBe(false);
    expect(isRestrictedRole('')).toBe(false);
    expect(isRestrictedRole(null)).toBe(false);
    expect(isRestrictedRole(undefined)).toBe(false);
  });
});

describe('SIGNUP_ROLES', () => {
  it('does not include Admin', () => {
    expect(SIGNUP_ROLES).not.toContain('Admin');
  });

  it('does not include Super Admin', () => {
    expect(SIGNUP_ROLES).not.toContain('Super Admin');
  });

  it('includes common non-admin roles', () => {
    expect(SIGNUP_ROLES).toContain('Chat Executive');
    expect(SIGNUP_ROLES).toContain('Team Lead');
    expect(SIGNUP_ROLES).toContain('Developer');
  });

  it('includes the Custom option', () => {
    expect(SIGNUP_ROLES).toContain('Custom');
  });
});


