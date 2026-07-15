import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const BuyerDashboard = () => {
  return (
    <div>
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Buyer Dashboard</CardTitle>
        </CardHeader>
        <p className="text-muted-foreground mt-4">
          Your purchases, orders, and buyer analytics will be displayed here...
        </p>
      </Card>
    </div>
  )
}

export default BuyerDashboard
