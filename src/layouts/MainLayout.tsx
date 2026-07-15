import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Categories', href: '/marketplace?view=categories' },
    { name: 'Sellers', href: '/sellers' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (user?.role === 'SELLER') return '/seller/dashboard'
    if (user?.role === 'BUYER') return '/buyer/dashboard'
    if (user?.role === 'ADMIN') return '/admin/dashboard'
    return '/'
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border shadow-glass">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white text-xl md:text-2xl font-bold">S</span>
              </div>
              <span className="text-xl md:text-2xl font-display font-bold text-gradient-primary">
                SoftMarket
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground font-medium hover:text-primary-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Icon - Mobile */}
              <button className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors">
                <Search className="h-5 w-5 text-foreground" />
              </button>

              {isAuthenticated ? (
                <>
                  {/* Dashboard Link */}
                  <Link to={getDashboardLink()} className="hidden md:block">
                    <Button variant="ghost" size="sm" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                      Dashboard
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-1 hover:bg-primary-50 rounded-lg transition-colors">
                      <Avatar
                        src={user?.avatar}
                        name={user?.name}
                        size="md"
                        verified={user?.isVerified}
                      />
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-64 glass rounded-xl shadow-glass-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to={getDashboardLink()}>
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-primary-50 rounded-lg transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </button>
                        </Link>
                        <Link to="/profile">
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-primary-50 rounded-lg transition-colors">
                            <User className="h-4 w-4" />
                            Profile
                          </button>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4 space-y-2 animate-fade-in">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-foreground font-medium hover:bg-primary-50 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full mb-2">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-foreground to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-xl font-bold">S</span>
                </div>
                <span className="text-2xl font-display font-bold">SoftMarket</span>
              </div>
              <p className="text-primary-100 leading-relaxed">
                The trusted marketplace for premium software solutions, connecting developers and businesses worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Marketplace</h3>
              <ul className="space-y-2">
                <li><Link to="/marketplace" className="text-primary-100 hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link to="/marketplace?view=categories" className="text-primary-100 hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/sellers" className="text-primary-100 hover:text-white transition-colors">Top Sellers</Link></li>
                <li><Link to="/marketplace?sort=rating" className="text-primary-100 hover:text-white transition-colors">Top Rated</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-primary-100 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-primary-100 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="text-primary-100 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="text-primary-100 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-primary-100 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-primary-100 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-primary-100 hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/licenses" className="text-primary-100 hover:text-white transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-100 text-sm">
              © 2026 SoftMarket. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-primary-100 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-primary-100 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-primary-100 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
