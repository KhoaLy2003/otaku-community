import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#dae0e6]">
      <Header />
      <div className="flex h-[calc(100vh-57px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Outlet />
          </div>
          <div className="h-8" />
        </main>
      </div>
    </div>
  )
}