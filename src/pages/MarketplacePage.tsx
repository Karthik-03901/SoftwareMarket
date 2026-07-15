import { useState } from 'react'
import { Filter, Grid, List } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <Card variant="glass" className="sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>
              <p className="text-muted-foreground text-sm">Filter options coming soon...</p>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground">
                Browse Marketplace
              </h1>
              <div className="flex items-center gap-2">
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

            <p className="text-muted-foreground text-center py-12">
              Marketplace listings will appear here...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage
