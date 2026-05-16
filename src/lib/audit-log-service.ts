import prisma from "@/lib/prisma";
import { headers } from "next/headers";

interface AuditLogOptions {
  actorId: string;
  actorEmail: string;
  organizationId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
}

export async function logAction(options: AuditLogOptions) {
  const headerList = await headers();
  const ipAddress = headerList.get("x-forwarded-for") || "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  try {
    return await prisma.auditLog.create({
      data: {
        ...options,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
  }
}

export async function getAuditLogs(organizationId: string, limit = 50) {
  return await prisma.auditLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
