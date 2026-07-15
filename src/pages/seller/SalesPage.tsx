import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const SalesPage = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Your sales transactions and revenue will be displayed here...
      </p>
    </Card>
  )
}

export default SalesPage
