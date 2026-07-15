import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const SellerDashboard = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Seller Dashboard</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Your sales analytics, listings, and seller metrics will be displayed here...
      </p>
    </Card>
  )
}

export default SellerDashboard
