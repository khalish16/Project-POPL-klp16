import { prisma } from '@/lib/prisma';
export class NutritionService { async upsert(userId:number,data:{age:number;gender:string;height:number;weight:number;activityLevel:string;goal:string}){ return prisma.nutritionProfile.upsert({where:{userId},create:{userId,...data},update:data}); } async get(userId:number){return prisma.nutritionProfile.findUnique({where:{userId}});} }
