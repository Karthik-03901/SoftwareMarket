import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const CreateListingPage = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Create a new software product listing form will be here...
      </p>
    </Card>
  )
}

export default CreateListingPage
