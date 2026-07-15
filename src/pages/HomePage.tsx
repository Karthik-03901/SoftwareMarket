import { Link } from 'react-router-dom'
import { Search, TrendingUp, Shield, Zap, Award, Users, ArrowRight, Star, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

const HomePage = () => {
  const categories = [
    { name: 'Web Development', count: 234, icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { name: 'Mobile Apps', count: 189, icon: '📱', color: 'from-purple-500 to-pink-500' },
    { name: 'SaaS Tools', count: 156, icon: '☁️', color: 'from-green-500 to-emerald-500' },
    { name: 'AI & ML', count: 98, icon: '🤖', color: 'from-orange-500 to-red-500' },
    { name: 'DevOps', count: 123, icon: '⚙️', color: 'from-indigo-500 to-blue-500' },
    { name: 'E-Commerce', count: 167, icon: '🛍️', color: 'from-pink-500 to-rose-500' },
  ]

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Transactions',
      description: 'Enterprise-grade security with Razorpay integration for safe payments',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Delivery',
      description: 'Get immediate access to your purchased software and documentation',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Quality Verified',
      description: 'All listings reviewed and approved by our expert team',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Trusted Community',
      description: 'Join 2000+ developers and businesses in our marketplace',
    },
  ]

  const stats = [
    { label: 'Active Listings', value: '500+', icon: <TrendingUp /> },
    { label: 'Registered Sellers', value: '200+', icon: <Users /> },
    { label: 'Successful Sales', value: '150+', icon: <Award /> },
    { label: 'Avg. Rating', value: '4.8', icon: <Star /> },
  ]

  const featuredProducts = [
    {
      id: 1,
      title: 'E-Commerce Platform Pro',
      category: 'E-Commerce',
      price: 49999,
      rating: 4.9,
      reviews: 234,
      seller: 'TechVendor Inc',
      verified: true,
      badge: 'Featured',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'AI Chatbot Framework',
      category: 'AI & ML',
      price: 34999,
      rating: 4.8,
      reviews: 189,
      seller: 'AI Solutions',
      verified: true,
      badge: 'Top Rated',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Mobile App Starter Kit',
      category: 'Mobile Apps',
      price: 29999,
      rating: 4.7,
      reviews: 156,
      seller: 'CodeCrafters',
      verified: true,
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-background py-20 md:py-32">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="animate-fade-in">
              <Badge variant="outline" size="lg" className="glass shadow-glass">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                Trusted by 2000+ Developers Worldwide
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight animate-slide-up">
              Discover Premium
              <span className="block text-gradient-primary mt-2">
                Software Solutions
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              Buy and sell quality software products, tools, and SaaS solutions in a secure, trusted marketplace designed for developers
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto animate-scale-in">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for software, tools, or solutions..."
                  className="h-16 text-lg pl-14 pr-40 glass shadow-glass-hover"
                  leftIcon={<Search className="h-6 w-6" />}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Link to="/marketplace">
                    <Button size="lg" className="h-12">
                      Search
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
              <Link to="/marketplace">
                <Button size="xl" variant="primary">
                  Browse Marketplace
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="xl" variant="outline">
                  Start Selling
                  <TrendingUp className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center text-primary-600 mb-3">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground font-display">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore software across diverse categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Link key={index} to={`/marketplace?category=${category.name}`}>
                <Card variant="glass" hover className="group">
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {category.count} Products
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="primary" size="lg" className="mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Featured Products
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Top Rated Software
            </h2>
            <p className="text-xl text-muted-foreground">
              Handpicked premium solutions from verified sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card variant="glass" hover className="group overflow-hidden p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="primary" size="md">
                        {product.badge}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <Badge variant="outline" size="sm" className="mb-3">
                        {product.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-semibold text-foreground">{product.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                          {product.seller[0]}
                        </div>
                        <span className="text-sm text-muted-foreground">{product.seller}</span>
                        {product.verified && (
                          <CheckCircle className="h-4 w-4 text-success-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-primary-700">
                        ₹{(product.price / 1000).toFixed(0)}K
                      </span>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Why Choose SoftMarket?
            </h2>
            <p className="text-xl text-muted-foreground">
              The most trusted platform for software transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} variant="glass" className="text-center group hover:shadow-glass-hover transition-shadow">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold">
              Ready to Start Selling?
            </h2>
            <p className="text-xl md:text-2xl text-primary-100">
              Join our growing community of successful software vendors and start monetizing your products today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="xl" className="bg-white text-primary-700 hover:bg-primary-50 shadow-2xl">
                  Create Seller Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
