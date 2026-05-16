export type Role = "SUPER_ADMIN" | "OWNER" | "MANAGER" | "ACCOUNTANT" | "DRIVER";

export const PERMISSIONS = {
  INVOICES_VIEW: ["SUPER_ADMIN", "OWNER", "MANAGER", "ACCOUNTANT"],
  INVOICES_MANAGE: ["SUPER_ADMIN", "OWNER", "MANAGER", "ACCOUNTANT"],
  VEHICLES_VIEW: ["SUPER_ADMIN", "OWNER", "MANAGER", "DRIVER"],
  VEHICLES_MANAGE: ["SUPER_ADMIN", "OWNER", "MANAGER"],
  EXPENSES_VIEW: ["SUPER_ADMIN", "OWNER", "MANAGER", "ACCOUNTANT"],
  EXPENSES_MANAGE: ["SUPER_ADMIN", "OWNER", "MANAGER", "ACCOUNTANT"],
  BILLING_MANAGE: ["SUPER_ADMIN", "OWNER"],
  USERS_MANAGE: ["SUPER_ADMIN", "OWNER"],
  REPORTS_VIEW: ["SUPER_ADMIN", "OWNER", "MANAGER", "ACCOUNTANT"],
  AUDIT_VIEW: ["SUPER_ADMIN", "OWNER"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
