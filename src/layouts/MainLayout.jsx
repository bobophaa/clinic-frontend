import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-row bg-[#F1F5F9]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
