import './globals.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'GymTrack — Pelacak Kebugaran',description:'Pelacak workout, nutrisi, dan progress kebugaran.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
