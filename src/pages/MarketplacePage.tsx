import { useState, useEffect } from 'react'
import { Filter, Grid, List, Search, SlidersHorizontal, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { formatCurrency } from '@/lib/utils'

// Mock data - replace with API call
const mockProducts = [
  {
    id: '1',
    title: 'E-Commerce Platform Pro',
    category: 'E-Commerce',
    price: 49999,
    rating: 4.9,
    reviews: 234,
    seller: 'TechVendor Inc',
    verified: true,
    badge: 'Featured',
    description: 'Complete e-commerce solution with payment integration',
    techStack: ['React', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'AI Chatbot Framework',
    category: 'AI & ML',
    price: 34999,
    rating: 4.8,
    reviews: 189,
    seller: 'AI Solutions',
    verified: true,
    badge: 'Top Rated',
    description: 'Advanced AI chatbot with NLP capabilities',
    techStack: ['Python', 'TensorFlow', 'React'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Mobile App Starter Kit',
    category: 'Mobile Apps',
    price: 29999,
    rating: 4.7,
    reviews: 156,
    seller: 'CodeCrafters',
    verified: true,
    badge: 'Best Seller',
    description: 'React Native starter with 50+ screens',
    techStack: ['React Native', 'TypeScript', 'Firebase'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'SaaS Dashboard Template',
    category: 'Web Development',
    price: 19999,
    rating: 4.6,
    reviews: 98,
    seller: 'DesignHub',
    verified: true,
    badge: 'New',
    description: 'Modern dashboard with analytics',
    techStack: ['React', 'Tailwind', 'Chart.js'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    title: 'CRM Software Complete',
    category: 'Business Tools',
    price: 59999,
    rating: 4.9,
    reviews: 312,
    seller: 'BizSoft',
    verified: true,
    badge: 'Featured',
    description: 'Full-featured CRM with automation',
    techStack: ['Vue.js', 'Laravel', 'MySQL'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    title: 'DevOps Automation Suite',
    category: 'DevOps',
    price: 44999,
    rating: 4.8,
    reviews: 201,
    seller: 'CloudOps Pro',
    verified: true,
    badge: 'Trending',
    description: 'CI/CD pipeline automation tools',
    techStack: ['Docker', 'Kubernetes', 'Jenkins'],
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',
  },
]

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Apps',
  'E-Commerce',
  'AI & ML',
  'DevOps',
  'Business Tools',
  'SaaS Tools',
]

const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹20K', value: '0-20000' },
  { label: '₹20K - ₹40K', value: '20000-40000' },
  { label: '₹40K - ₹60K', value: '40000-60000' },
  { label: 'Above ₹60K', value: '60000-999999' },
]

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
]

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [showFilters, setShowFilters] = useState(false)

  // Filter products based on search and filters
  useEffect(() => {
    let results = [...mockProducts]

    // Search filter
    if (searchQuery) {
      results = results.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      results = results.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number)
      results = results.filter((product) => product.price >= min && product.price <= max)
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'price-asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // Assuming mockProducts is already sorted by newest
        break
      default:
        // Popular - sort by reviews
        results.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredProducts(results)
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Browse Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover {filteredProducts.length} premium software solutions
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 glass rounded-xl p-4 shadow-card">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search products, sellers, or keywords..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full"
              />
            </div>

            {/* Category Select */}
            <div className="w-full lg:w-48">
              <Select
                options={categories.map((cat) => ({ label: cat, value: cat }))}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div className="w-full lg:w-48">
              <Select
                options={priceRanges}
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              />
            </div>

            {/* Filters Toggle (Mobile) */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
              leftIcon={<SlidersHorizontal className="h-5 w-5" />}
            >
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card variant="glass" className="sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-foreground">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                    >
                      <input type="checkbox" className="text-primary-600 focus:ring-primary-500" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-foreground ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Sellers */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                  <input type="checkbox" className="text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-foreground">Verified Sellers Only</span>
                </label>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> results
              </p>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-48"
                />

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 glass rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Card variant="glass" className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All Categories')
                    setSelectedPriceRange('all')
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card variant="glass" hover className="group overflow-hidden p-0 h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="primary" size="md">
                            {product.badge}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <Badge variant="outline" size="sm" className="mb-3">
                            {product.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                          {product.techStack.map((tech) => (
                            <Badge key={tech} variant="secondary" size="sm">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-semibold text-foreground">{product.rating}</span>
                          </div>
                          <span className="text-muted-foreground">({product.reviews} reviews)</span>
                        </div>

                        {/* Seller */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Avatar name={product.seller} size="sm" verified={product.verified} />
                            <span className="text-sm text-muted-foreground">{product.seller}</span>
                          </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-bold text-primary-700">
                            {formatCurrency(product.price)}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" size="md" disabled>
                  Previous
                </Button>
                <Button variant="primary" size="md">
                  1
                </Button>
                <Button variant="outline" size="md">
                  2
                </Button>
                <Button variant="outline" size="md">
                  3
                </Button>
                <Button variant="outline" size="md">
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage
