import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const MyListingsPage = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>My Listings</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Manage your software product listings here...
      </p>
    </Card>
  )
}

export default MyListingsPage
