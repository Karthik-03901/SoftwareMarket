import { useEffect, useState } from 'react'
import { testSupabaseConnection } from '@/lib/supabase'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { CheckCircle, XCircle, Database, RefreshCw } from 'lucide-react'

interface ConnectionStatus {
  connected: boolean
  message?: string
  error?: string
  data?: any
}

const SupabaseTest = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: '',
    hasKey: false,
  })

  useEffect(() => {
    // Get Supabase configuration info
    const url = import.meta.env.VITE_SUPABASE_URL || ''
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    
    setSupabaseInfo({
      url,
      hasKey: key.length > 0,
    })

    // Auto-test connection on mount
    handleTestConnection()
  }, [])

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const result = await testSupabaseConnection()
      setStatus(result)
    } catch (error) {
      setStatus({
        connected: false,
        error: String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (loading) {
      return <Badge variant="warning">Testing...</Badge>
    }
    if (status?.connected) {
      return <Badge variant="success">Connected</Badge>
    }
    return <Badge variant="danger">Disconnected</Badge>
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Supabase Connection</h2>
            <p className="text-sm text-muted-foreground">Database connectivity status</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-start gap-3">
            {loading ? (
              <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin mt-0.5" />
            ) : status?.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {loading ? 'Testing connection...' : status?.connected ? 'Connected Successfully' : 'Connection Failed'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {status?.message || status?.error || 'Click the button below to test the connection'}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Supabase URL</div>
            <div className="text-sm font-mono text-foreground break-all">
              {supabaseInfo.url || 'Not configured'}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Anonymous Key</div>
            <div className="text-sm font-mono text-foreground">
              {supabaseInfo.hasKey ? '••••••••••••••••' : 'Not configured'}
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleTestConnection}
            isLoading={loading}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Test Connection
          </Button>
        </div>

        {/* Status Details */}
        {status && !loading && (
          <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2">Connection Details</h4>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  )
}

export default SupabaseTest
