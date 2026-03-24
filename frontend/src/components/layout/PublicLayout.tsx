import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { MobileSidebar } from './MobileSidebar'

export function PublicLayout() {
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        // Close mobile menu on route change
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    return (
        <div className="h-screen flex flex-col bg-[#dae0e6] overflow-hidden">
            <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
            <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <main className="flex-1 min-h-0 overflow-hidden">
                <div className="mx-auto max-w-full md:max-w-7xl px-0 sm:px-4 py-2 md:py-4 h-full flex flex-col">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
