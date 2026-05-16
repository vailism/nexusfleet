import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter for demonstration
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

  if (now - userData.lastRequest > windowMs) {
    userData.count = 1;
    userData.lastRequest = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  return userData.count <= limit;
}

export function validateCSRF(req: NextRequest) {
  const csrfToken = req.headers.get("x-csrf-token");
  const cookieToken = req.cookies.get("csrf-token")?.value;

  if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
    return false;
  }
  return true;
}

export const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
};
