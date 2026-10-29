import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  Download,
  Shield,
  CheckCircle,
  MessageSquare,
  Share2,
  Heart,
  ExternalLink,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Package,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Rating from '@/components/ui/Rating'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

// Mock product data - replace with API call
const mockProducts: Record<string, any> = {
  '1': {
    id: '1',
    title: 'E-Commerce Platform Pro',
    category: 'E-Commerce',
    price: 49999,
    rating: 4.9,
    reviews: 234,
    totalSales: 1250,
    seller: {
      name: 'TechVendor Inc',
      avatar: '',
      verified: true,
      rating: 4.8,
      responseTime: '2 hours',
      totalSales: 5420,
      memberSince: '2022-01-15',
    },
    images: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    ],
    description: `A complete e-commerce solution built with modern technologies. This platform includes everything you need to launch and scale your online store.

Perfect for small to medium-sized businesses looking to establish a professional online presence with minimal setup time.`,
    features: [
      'Full shopping cart functionality',
      'Payment gateway integration (Stripe, PayPal, Razorpay)',
      'Inventory management system',
      'Order tracking and fulfillment',
      'Customer account management',
      'Admin dashboard with analytics',
      'Mobile-responsive design',
      'SEO optimized',
      'Multi-currency support',
      'Email notifications',
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe API'],
    requirements: [
      'Node.js v16 or higher',
      'MongoDB database',
      'Stripe account (for payments)',
      'Domain and hosting',
    ],
    whatsIncluded: [
      'Full source code',
      'Documentation (50+ pages)',
      'Installation guide',
      'Video tutorials (5 hours)',
      '6 months of updates',
      'Priority email support',
    ],
    demoUrl: 'https://demo.ecommerce-pro.com',
    lastUpdated: '2024-10-15',
    version: '2.5.0',
    downloads: 1250,
    licenseType: 'One-time purchase',
  },
  '2': {
    id: '2',
    title: 'AI Chatbot Framework',
    category: 'AI & ML',
    price: 34999,
    rating: 4.8,
    reviews: 189,
    totalSales: 890,
    seller: {
      name: 'AI Solutions',
      avatar: '',
      verified: true,
      rating: 4.9,
      responseTime: '1 hour',
      totalSales: 3240,
      memberSince: '2021-06-20',
    },
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    ],
    description: 'Advanced AI chatbot framework with natural language processing capabilities. Build intelligent conversational interfaces for your business.',
    features: [
      'Natural Language Processing',
      'Multi-language support',
      'Intent recognition',
      'Sentiment analysis',
      'Context management',
      'Analytics dashboard',
      'API integration',
      'Custom training',
    ],
    techStack: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],
    requirements: ['Python 3.8+', 'TensorFlow 2.0+', 'GPU recommended'],
    whatsIncluded: ['Source code', 'Pre-trained models', 'Documentation', 'API access'],
    demoUrl: 'https://demo.ai-chatbot.com',
    lastUpdated: '2024-09-28',
    version: '3.1.0',
    downloads: 890,
    licenseType: 'Per-seat license',
  },
  '3': {
    id: '3',
    title: 'Mobile App Starter Kit',
    category: 'Mobile Apps',
    price: 29999,
    rating: 4.7,
    reviews: 156,
    totalSales: 670,
    seller: {
      name: 'CodeCrafters',
      avatar: '',
      verified: true,
      rating: 4.7,
      responseTime: '3 hours',
      totalSales: 2100,
      memberSince: '2022-03-10',
    },
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    ],
    description: 'React Native starter kit with 50+ pre-built screens and components. Launch your mobile app in days, not months.',
    features: [
      '50+ screen templates',
      'Authentication flows',
      'Push notifications',
      'In-app purchases',
      'Social media integration',
      'Dark mode support',
    ],
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    requirements: ['Node.js', 'React Native CLI', 'iOS/Android SDK'],
    whatsIncluded: ['Full source code', 'Figma designs', 'Documentation'],
    demoUrl: 'https://demo.mobile-starter.com',
    lastUpdated: '2024-10-01',
    version: '1.8.0',
    downloads: 670,
    licenseType: 'One-time purchase',
  },
}

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    user: 'John Smith',
    avatar: '',
    rating: 5,
    date: '2024-10-10',
    verified: true,
    comment: 'Excellent product! The code quality is top-notch and the documentation is comprehensive. Saved me weeks of development time.',
  },
  {
    id: '2',
    user: 'Sarah Johnson',
    avatar: '',
    rating: 5,
    date: '2024-10-05',
    verified: true,
    comment: 'Great support from the seller. They helped me with customization and answered all my questions promptly.',
  },
  {
    id: '3',
    user: 'Mike Chen',
    avatar: '',
    rating: 4,
    date: '2024-09-28',
    verified: false,
    comment: 'Good product overall. Some features need better documentation, but the core functionality works well.',
  },
]

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'support'>('description')

  // Get product data
  const product = mockProducts[id || '1'] || mockProducts['1']

  const handleBuyNow = () => {
    toast.success('Redirecting to checkout...', {
      description: 'You will be redirected to the payment page',
    })
    // Implement checkout logic
  }

  const handleContactSeller = () => {
    toast.success('Opening chat with seller...', {
      description: `Starting conversation with ${product.seller.name}`,
    })
    // Implement messaging logic
  }

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist!', {
      description: `${product.title} has been added to your wishlist`,
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card variant="glass" className="p-0 overflow-hidden">
              <div className="relative h-96 md:h-[500px] bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge variant="primary" size="lg">
                    Featured
                  </Badge>
                  {product.seller.verified && (
                    <Badge variant="success" size="lg">
                      Verified Seller
                    </Badge>
                  )}
                </div>
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-600 scale-105'
                          : 'border-border hover:border-primary-300'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Tabs */}
            <Card variant="glass">
              {/* Tab Headers */}
              <div className="flex gap-4 border-b border-border pb-4">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'description'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Reviews ({product.reviews})
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === 'support'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Support
                </button>
              </div>

              {/* Tab Content */}
              <div className="pt-6">
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">About This Product</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Technology Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.techStack.map((tech: string) => (
                          <Badge key={tech} variant="secondary" size="lg">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* What's Included */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">What's Included</h3>
                      <div className="space-y-2">
                        {product.whatsIncluded.map((item: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary-600" />
                            <span className="text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {product.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-8 p-6 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-foreground mb-2">{product.rating}</div>
                        <Rating rating={product.rating} size="lg" readonly />
                        <p className="text-sm text-muted-foreground mt-2">{product.reviews} reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-12">{stars} star</span>
                            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${stars === 5 ? 80 : stars === 4 ? 15 : 5}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {stars === 5 ? 187 : stars === 4 ? 35 : 12}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="p-6 bg-muted rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={review.user} size="md" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{review.user}</span>
                                  {review.verified && (
                                    <Badge variant="success" size="sm">
                                      Verified Purchase
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                              </div>
                            </div>
                            <Rating rating={review.rating} size="sm" readonly />
                          </div>
                          <p className="text-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card variant="bordered" className="p-6">
                        <MessageSquare className="h-8 w-8 text-primary-600 mb-3" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Contact Seller</h3>
                        <p className="text-muted-foreground mb-4">
                          Get instant support from the seller. Average response time: {product.seller.responseTime}
                        </p>
                        <Button variant="primary" onClick={handleContactSeller} className="w-full">
                          Send Message
                        </Button>
                      </Card>

                      <Card variant="bordered" className="p-6">
                        <Shield className="h-8 w-8 text-success-600 mb-3" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Buyer Protection</h3>
                        <p className="text-muted-foreground mb-4">
                          Full refund if product doesn't match description or has critical issues.
                        </p>
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Card>
                    </div>

                    <div className="p-6 bg-muted rounded-lg">
                      <h3 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            Do I get lifetime updates?
                          </h4>
                          <p className="text-muted-foreground">
                            You get 6 months of free updates. Extended support is available for purchase.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Can I use this for client projects?</h4>
                          <p className="text-muted-foreground">
                            Yes, you can use this for unlimited client projects with the {product.licenseType}.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Is the source code included?</h4>
                          <p className="text-muted-foreground">
                            Yes, you get complete access to the full source code.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <Card variant="glass" className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-foreground">{formatCurrency(product.price)}</span>
                    <Badge variant="outline" size="sm">
                      {product.licenseType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{product.downloads} sales</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button variant="primary" size="lg" className="w-full" onClick={handleBuyNow}>
                    Buy Now
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={handleContactSeller}>
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contact Seller
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="md" className="flex-1" onClick={handleAddToWishlist}>
                      <Heart className="h-5 w-5 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" size="md" className="flex-1">
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Version</span>
                    <span className="text-foreground font-medium">{product.version}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-foreground font-medium">{formatDate(product.lastUpdated)}</span>
                  </div>
                </div>

                {/* Demo Link */}
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-6 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View Live Demo
                  </a>
                )}
              </Card>

              {/* Seller Card */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">About the Seller</h3>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar name={product.seller.name} size="lg" verified={product.seller.verified} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{product.seller.name}</h4>
                    </div>
                    <Rating rating={product.seller.rating} size="sm" showValue readonly />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Total Sales:</span>
                    <span className="text-foreground font-medium">{product.seller.totalSales}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="text-foreground font-medium">{product.seller.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member Since:</span>
                    <span className="text-foreground font-medium">
                      {formatDate(product.seller.memberSince)}
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="md" className="w-full mt-4">
                  View Seller Profile
                </Button>
              </Card>

              {/* Trust Badges */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Why Buy Here?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Secure Payments</h4>
                      <p className="text-xs text-muted-foreground">Protected by Razorpay</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Quality Verified</h4>
                      <p className="text-xs text-muted-foreground">Reviewed by our team</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Money Back Guarantee</h4>
                      <p className="text-xs text-muted-foreground">7-day refund policy</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
