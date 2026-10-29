import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import Avatar from '@/components/ui/Avatar'

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation items based on user role
  const getNavItems = () => {
    if (user?.role === 'SELLER') {
      return [
        { name: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
        { name: 'My Listings', href: '/seller/listings', icon: Package },
        { name: 'Sales', href: '/seller/sales', icon: TrendingUp },
        { name: 'Inquiries', href: '/seller/inquiries', icon: MessageSquare },
        { name: 'Create Listing', href: '/seller/create-listing', icon: Package },
      ]
    } else if (user?.role === 'BUYER') {
      return [
        { name: 'Dashboard', href: '/buyer/dashboard', icon: LayoutDashboard },
        { name: 'My Orders', href: '/buyer/orders', icon: ShoppingBag },
      ]
    } else if (user?.role === 'ADMIN') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Listings', href: '/admin/listings', icon: Package },
        { name: 'Transactions', href: '/admin/transactions', icon: TrendingUp },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 glass border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <span className="text-xl font-display font-bold text-gradient-primary hidden md:block">
              SoftMarket
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 rounded-lg glass border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size="md"
                verified={user?.isVerified}
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 min-h-screen border-r border-border glass">
          <nav className="flex flex-col w-full p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}

            {/* Divider */}
            <div className="border-t border-border my-4"></div>

            {/* Settings */}
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-red-50 transition-all w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
