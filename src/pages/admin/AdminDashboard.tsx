import Card, { CardHeader, CardTitle } from '@/components/ui/Card'

const AdminDashboard = () => {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <p className="text-muted-foreground mt-4">
        Platform analytics, user management, and admin tools will be displayed here...
      </p>
    </Card>
  )
}

export default AdminDashboard
