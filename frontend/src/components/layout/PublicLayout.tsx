import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function PublicLayout() {
    return (
        <div className="h-screen flex flex-col bg-[#dae0e6]">
            <Header />

            <main className="flex-1 overflow-hidden">
                <div className="mx-auto max-w-8xl px-4 py-4 h-full flex flex-col">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
