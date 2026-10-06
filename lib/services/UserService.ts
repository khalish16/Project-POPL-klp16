import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
export class UserService {
  async register(username:string,password:string){ if(username.trim().length<3||password.length<6) throw new Error('Username minimal 3 karakter dan password minimal 6 karakter.'); const exists=await prisma.user.findUnique({where:{username:username.trim()}}); if(exists) throw new Error('Username sudah digunakan.'); const passwordHash=await bcrypt.hash(password,12); return prisma.user.create({data:{username:username.trim(),passwordHash,profile:{create:{}}}}); }
  async login(username:string,password:string){ const user=await prisma.user.findUnique({where:{username:username.trim()}}); if(!user||!(await bcrypt.compare(password,user.passwordHash))) throw new Error('Username atau password salah.'); return user; }
}
