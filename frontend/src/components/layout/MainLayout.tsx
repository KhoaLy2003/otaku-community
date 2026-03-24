import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileSidebar } from './MobileSidebar'

export function MainLayout() {
  const mainRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
    // Close mobile menu on route change
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="h-screen flex flex-col bg-[#dae0e6] overflow-hidden">
      <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main
          ref={mainRef}
          id="main-scroll"
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
        >
          <div className="mx-auto max-w-[1280px] px-0 sm:px-4 py-2 sm:py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}