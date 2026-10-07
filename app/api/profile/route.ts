import {NextResponse} from 'next/server';import {requireUser} from '@/lib/auth';import {prisma} from '@/lib/prisma';
export async function GET(){const u=await requireUser();return NextResponse.json(await prisma.userProfile.findUnique({where:{userId:u.id}}))}
export async function PUT(req:Request){try{const u=await requireUser();const d=await req.json();return NextResponse.json(await prisma.userProfile.upsert({where:{userId:u.id},create:{userId:u.id,...d},update:d}))}catch(e:any){return NextResponse.json({message:e.message},{status:400})}}
export async function DELETE(){try{const u=await requireUser();await prisma.userProfile.deleteMany({where:{userId:u.id}});return NextResponse.json({success:true})}catch(e:any){return NextResponse.json({message:e.message},{status:400})}}
