import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
const COOKIE = 'gymtrack_session';
const secret = () => process.env.SESSION_SECRET || 'gymtrack-development-secret';
export function signSession(userId: number) { const payload = `${userId}.${Date.now()}`; const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex'); return `${payload}.${sig}`; }
function verify(value: string) { const parts = value.split('.'); if (parts.length !== 3) return null; const [id, ts, sig] = parts; const expected = crypto.createHmac('sha256', secret()).update(`${id}.${ts}`).digest('hex'); if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null; if (Date.now() - Number(ts) > 7 * 24 * 60 * 60 * 1000) return null; return Number(id); }
export async function setSession(userId: number) { (await cookies()).set(COOKIE, signSession(userId), { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge:7*24*60*60 }); }
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function getCurrentUser() { const value = (await cookies()).get(COOKIE)?.value; if (!value) return null; const id = verify(value); if (!id) return null; return prisma.user.findUnique({ where:{id}, include:{profile:true,nutrition:true} }); }
export async function requireUser() { const user = await getCurrentUser(); if (!user) throw new Error('UNAUTHORIZED'); return user; }
