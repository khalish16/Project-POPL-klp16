import Sidebar from './Sidebar';
export default function AppShell({children,title}:{children:React.ReactNode;title:string}){return <><Sidebar/><main className="min-h-screen md:ml-64"><div className="mx-auto max-w-7xl p-5 pt-16 md:p-8"><div className="mb-7"><h1 className="text-2xl font-bold text-gray-900">{title}</h1></div>{children}</div></main></>}
