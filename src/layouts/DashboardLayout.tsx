import { Outlet } from 'react-router-dom'
import Card from '@/components/ui/Card'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
