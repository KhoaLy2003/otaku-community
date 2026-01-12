import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  return (
    // <div className="h-screen flex flex-col bg-[#dae0e6]">
    //   <Header />
    //   <div className="flex h-[calc(100vh-57px)]">
    //     <Sidebar />
    //     <main className="flex-1 overflow-y-auto">
    //       <div className="mx-auto max-w-6xl px-4 py-6">
    //         <Outlet />
    //       </div>
    //       <div className="h-8" />
    //     </main>
    //   </div>
    // </div>

    // <div className="h-screen flex flex-col bg-[#dae0e6]">
    //   <Header />
    //   <div className="flex h-[calc(100vh-57px)]">
    //     <Sidebar />
    //     <main className="flex-1 overflow-y-auto">
    //       <div className="mx-auto max-w-6xl px-4 py-6">
    //         <Outlet />
    //       </div>
    //     </main>
    //   </div>
    // </div>

    <div className="h-screen flex flex-col bg-[#dae0e6] overflow-hidden">
      <Header />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main
          id="main-scroll"
          className="flex-1 overflow-y-auto min-h-0"
        >
          <div className="mx-auto max-w-6xl px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}