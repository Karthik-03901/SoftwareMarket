import SupabaseTest from '@/components/SupabaseTest'

const TestSupabasePage = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Database Connection Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Verify Supabase database connectivity
          </p>
        </div>

        <SupabaseTest />
      </div>
    </div>
  )
}

export default TestSupabasePage
