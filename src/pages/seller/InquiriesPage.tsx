import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const InquiriesPage = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Buyer Inquiries</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Messages and inquiries from buyers will be displayed here...
      </p>
    </Card>
  )
}

export default InquiriesPage
