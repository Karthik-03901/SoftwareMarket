import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const OrdersPage = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Your order history will be displayed here...
      </p>
    </Card>
  )
}

export default OrdersPage
