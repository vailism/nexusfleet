"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrganization(name: string, userId: string) {
  try {
    const org = await prisma.organization.create({
      data: {
        name,
        members: {
          create: {
            userId,
            role: "OWNER",
          }
        }
      }
    });
    
    revalidatePath("/");
    return { success: true, data: org };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getUserOrganizations(userId: string) {
  return await prisma.organization.findMany({
    where: {
      members: {
        some: { userId }
      }
    },
    include: {
      members: {
        where: { userId }
      }
    }
  });
}

export async function switchActiveOrganization(orgId: string) {
  // In a real app with next-auth, you would update the JWT/Session
  // or set a secure HttpOnly cookie indicating the active tenant.
  
  // Example conceptually:
  // cookies().set("active-tenant", orgId);
  
  revalidatePath("/");
  return { success: true };
}
