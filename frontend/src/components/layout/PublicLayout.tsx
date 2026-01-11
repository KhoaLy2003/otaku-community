import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function PublicLayout() {
    return (
        <div className="h-screen overflow-hidden bg-[#dae0e6]">
            <Header />
            <main className="h-[calc(100vh-57px)] overflow-y-auto">
                <div className="mx-auto max-w-8xl px-4 py-4">
                    <Outlet />
                </div>
                <div className="h-8" />
            </main>
        </div>
    )
}
