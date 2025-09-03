'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bot, 
  Plus, 
  Trash2,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  TestTube,
  DollarSign,
  Activity,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCost, formatTokens, getSuccessRateColor } from '@/lib/ai-utils';

interface AIProvider {
  id: string;
  name: string;
  displayName: string;
  apiKey: string;
  isActive: boolean;
  models: string[];
  defaultModel?: string;
  temperature?: number;
  createdAt: string;
  testCount: number;
}

interface ProviderStats {
  usage: {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
  };
  tests: {
    totalTests: number;
    successRate: number;
    averageResponseTime: number;
  };
}

interface TestResult {
  success: boolean;
  response?: string;
  error?: string;
  responseTime: number;
  tokensUsed: number;
  cost: number;
}

export default function AIManagementPage() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [providerStats, setProviderStats] = useState<Record<string, ProviderStats>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    apiKey: '',
    models: [] as string[],
    defaultModel: '',
    temperature: 0.7
  });

  // Predefined models for each provider
  const providerModels = {
    openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'gemini-pro-vision'],
    claude: ['claude-3.5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    custom: []
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    // Load stats for all providers when providers list changes
    providers.forEach(provider => {
      fetchProviderStats(provider.id);
    });
  }, [providers]);

  const fetchProviderStats = async (providerId: string) => {
    try {
      const response = await fetch(`/api/admin/ai-providers/${providerId}/stats?days=7`);
      
      if (response.ok) {
        const data = await response.json();
        setProviderStats(prev => ({
          ...prev,
          [providerId]: data.stats
        }));
      }
    } catch (error) {
      console.error('Error fetching provider stats:', error);
    }
  };

  const handleTestProvider = async (providerId: string) => {
    setTestingProviderId(providerId);
    
    try {
      const response = await fetch(`/api/admin/ai-providers/${providerId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testPrompt: "Hello! This is a connection test. Please respond with 'Test successful' to confirm the API is working."
        })
      });

      const result = await response.json();
      
      if (result.success && result.result.success) {
        toast.success(`Test successful! Response time: ${result.result.responseTime}ms`);
        // Refresh stats after test
        fetchProviderStats(providerId);
      } else {
        toast.error(`Test failed: ${result.result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error testing provider:', error);
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setTestingProviderId(null);
    }
  };

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai-providers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      
      const data = await response.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load AI providers');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (providerName: string) => {
    const models = providerModels[providerName as keyof typeof providerModels] || [];
    setFormData({
      ...formData,
      name: providerName,
      models,
      defaultModel: models[0] || ''
    });
  };

  const handleAddProvider = async () => {
    if (!formData.name || !formData.displayName || !formData.apiKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add provider');
      }

      toast.success('AI provider added successfully');
      setShowAddDialog(false);
      resetForm();
      fetchProviders();
    } catch (error: any) {
      console.error('Error adding provider:', error);
      toast.error(error.message || 'Failed to add provider');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ai-providers/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }

      toast.success('Provider deleted successfully');
      fetchProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      apiKey: '',
      models: [],
      defaultModel: '',
      temperature: 0.7
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Provider Management</h1>
        <p className="text-gray-600">Manage your AI providers and API configurations</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {providers.length} Provider{providers.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProviders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add AI Provider</DialogTitle>
                <DialogDescription>
                  Configure a new AI provider for your application
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Provider Type *</Label>
                    <Select onValueChange={handleProviderSelect} value={formData.name}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="claude">Anthropic Claude</SelectItem>
                        <SelectItem value="custom">Custom Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Display Name *</Label>
                    <Input
                      placeholder="e.g., My OpenAI API"
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>API Key *</Label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  />
                </div>

                {formData.models.length > 0 && (
                  <div>
                    <Label>Available Models</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-gray-50">
                      {formData.models.map((model) => (
                        <Badge key={model} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Model</Label>
                    <Select 
                      value={formData.defaultModel}
                      onValueChange={(value) => setFormData({...formData, defaultModel: value})}
                      disabled={formData.models.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.models.map((model) => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value) || 0.7})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProvider} disabled={loading}>
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Provider
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(providerStats).reduce((sum, stats) => sum + (stats?.usage.totalRequests || 0), 0).toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTokens(Object.values(providerStats).reduce((sum, stats) => sum + (stats?.usage.totalTokens || 0), 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCost(Object.values(providerStats).reduce((sum, stats) => sum + (stats?.usage.totalCost || 0), 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Test Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const allStats = Object.values(providerStats);
                    const totalTests = allStats.reduce((sum, stats) => sum + (stats?.tests.totalTests || 0), 0);
                    const avgSuccessRate = totalTests > 0 
                      ? allStats.reduce((sum, stats) => sum + (stats?.tests.successRate || 0), 0) / allStats.length
                      : 0;
                    return `${avgSuccessRate.toFixed(1)}%`;
                  })()}
                </p>
              </div>
              <TestTube className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Providers Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Providers
          </CardTitle>
          <CardDescription>
            Manage your configured AI providers and their settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && providers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading providers...
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-12 px-6">
              <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Providers</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first AI provider</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Provider
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Provider</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[200px]">Usage Stats</TableHead>
                    <TableHead className="w-[250px]">Models</TableHead>
                    <TableHead className="w-[150px]">API Key</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => {
                    const stats = providerStats[provider.id];
                    return (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{provider.displayName}</div>
                            <div className="text-sm text-gray-500">{provider.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={provider.isActive ? "default" : "secondary"}>
                            {provider.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {stats ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Activity className="h-3 w-3" />
                                <span>{stats.usage.totalRequests} requests</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <TrendingUp className="h-3 w-3" />
                                <span>{formatTokens(stats.usage.totalTokens)} tokens</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <DollarSign className="h-3 w-3" />
                                <span>{formatCost(stats.usage.totalCost)}</span>
                              </div>
                              {stats.tests.totalTests > 0 && (
                                <div className={`text-xs ${getSuccessRateColor(stats.tests.successRate)}`}>
                                  {stats.tests.successRate.toFixed(1)}% success rate
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">Loading...</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {provider.models.slice(0, 2).map((model) => (
                              <Badge key={model} variant="outline" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                            {provider.models.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.models.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Default: {provider.defaultModel || 'None'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {provider.apiKey}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleTestProvider(provider.id)}
                              disabled={testingProviderId === provider.id}
                              title="Test API connection"
                            >
                              {testingProviderId === provider.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <TestTube className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" title="Provider settings">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteProvider(provider.id)}
                              title="Delete provider"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
