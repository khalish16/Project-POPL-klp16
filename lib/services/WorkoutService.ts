import { prisma } from '@/lib/prisma';
export class WorkoutService {
 async active(userId:number){return prisma.workoutSession.findFirst({where:{userId,status:'AKTIF'},include:{exercises:{orderBy:{orderIndex:'asc'},include:{sets:{orderBy:{createdAt:'asc'}}}}}});}
 async start(userId:number,name:string){const active=await this.active(userId);if(active)throw new Error('Masih ada workout aktif.');return prisma.workoutSession.create({data:{userId,name:name||'Workout Saya',status:'AKTIF',startedAt:new Date()}});}
 async finish(userId:number,id:number){return prisma.workoutSession.updateMany({where:{id,userId,status:'AKTIF'},data:{status:'SELESAI',finishedAt:new Date()}});}
 async cancel(userId:number,id:number){return prisma.workoutSession.updateMany({where:{id,userId,status:'AKTIF'},data:{status:'DIBATALKAN',finishedAt:new Date()}});}
 async list(userId:number){return prisma.workoutSession.findMany({where:{userId},orderBy:{createdAt:'desc'},include:{exercises:{include:{sets:true},orderBy:{orderIndex:'asc'}}}});}
 async addExercise(userId:number,workoutId:number,name:string){const workout=await prisma.workoutSession.findFirst({where:{id:workoutId,userId,status:'AKTIF'}});if(!workout)throw new Error('Workout aktif tidak ditemukan.');const count=await prisma.exercise.count({where:{workoutId}});return prisma.exercise.create({data:{workoutId,name:name.trim(),orderIndex:count+1}});}
 async addSet(userId:number,exerciseId:number,data:{weight:number;reps:number;note?:string}){const exercise=await prisma.exercise.findFirst({where:{id:exerciseId,workout:{userId,status:'AKTIF'}}});if(!exercise)throw new Error('Exercise tidak ditemukan.');return prisma.exerciseSet.create({data:{exerciseId,...data}});}
}
