'use client';
import {useEffect,useState} from 'react';
export function Toast({message,type='success'}:{message:string;type?:'success'|'error'}){const [show,setShow]=useState(true);useEffect(()=>{const t=setTimeout(()=>setShow(false),3000);return()=>clearTimeout(t)},[]);if(!show)return null;return <div className={`fixed right-5 top-5 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${type==='success'?'bg-brand-600 text-white':'bg-red-600 text-white'}`}>{message}</div>}
