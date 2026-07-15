import { useParams } from 'react-router-dom'
import Card from '@/components/ui/Card'

const ProductDetailPage = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Card variant="glass">
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">
            Product Detail Page
          </h1>
          <p className="text-muted-foreground">
            Product ID: {id}
          </p>
          <p className="text-muted-foreground mt-4">
            Detailed product information will be displayed here...
          </p>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetailPage
