"use client";

import { hasPermission, Permission, Role } from "@/lib/permissions";
import { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  userRole: Role;
  permission: Permission;
  fallback?: ReactNode;
}

export function PermissionGuard({ children, userRole, permission, fallback }: PermissionGuardProps) {
  if (hasPermission(userRole, permission)) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
}
