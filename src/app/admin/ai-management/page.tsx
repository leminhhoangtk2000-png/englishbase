'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  TestTube, 
  Plus, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  DollarSign,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface AIProvider {
  id: string;
  name: string;
  displayName: string;
  apiKey: string;
  baseUrl?: string;
  isActive: boolean;
  models: string[];
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
  testCount: number;
  createdAt: string;
}

interface TestResult {
  id: string;
  providerId: string;
  provider: {
    name: string;
    displayName: string;
  };
  model: string;
  prompt: string;
  response?: string;
  success: boolean;
  error?: string;
  responseTime?: number;
  tokensUsed?: number;
  cost?: number;
  createdAt: string;
}

interface AIStats {
  totalTokens: number;
  totalCost: number;
  totalTests: number;
}

export default function AIManagementPage() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState<AIStats>({ totalTokens: 0, totalCost: 0, totalTests: 0 });
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  
  // Form states
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: '',
    displayName: '',
    apiKey: '',
    baseUrl: '',
    models: [] as string[],
    defaultModel: '',
    temperature: 0.7
  });

  // Predefined models for each provider
  const providerModels = {
    openai: [
      'gpt-4o',
      'gpt-4o-mini', 
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ],
    gemini: [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro',
      'gemini-pro-vision'
    ],
    claude: [
      'claude-3.5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ]
  };

  // Test states
  const [testPrompt, setTestPrompt] = useState('Explain quantum physics in simple terms.');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    fetchProviders();
    fetchTestResults();
    fetchStats();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/ai-providers');
      const data = await response.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to fetch AI providers');
    }
  };

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/admin/ai-test-results');
      const data = await response.json();
      setTestResults(data.testResults || []);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/ai-stats');
      const data = await response.json();
      setStats({
        totalTokens: data.totalTokens || 0,
        totalCost: data.totalCost || 0,
        totalTests: data.totalTests || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddProvider = async () => {
    if (!newProvider.name || !newProvider.displayName || !newProvider.apiKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProvider,
          models: newProvider.models
        }),
      });

      if (response.ok) {
        toast.success('AI provider added successfully');
        setShowAddProvider(false);
        setNewProvider({
          name: '',
          displayName: '',
          apiKey: '',
          baseUrl: '',
          models: [],
          defaultModel: '',
          temperature: 0.7
        });
        fetchProviders();
      } else {
        const error = await response.json();
        toast.error('Failed to add provider: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding provider:', error);
      toast.error('Failed to add provider');
    } finally {
      setLoading(false);
    }
  };

  const handleTestProvider = async () => {
    if (!selectedProvider || !testPrompt) {
      toast.error('Please select a provider and enter a test prompt');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/ai-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          prompt: testPrompt,
          model: selectedModel || undefined
        }),
      });

      const result = await response.json();
      setTestResult(result);

      if (result.success) {
        toast.success('Test completed successfully!');
      } else {
        toast.error('Test failed: ' + result.error);
      }

      fetchTestResults();
      fetchStats(); // Refresh stats after test
    } catch (error) {
      console.error('Error testing provider:', error);
      toast.error('Test failed');
    } finally {
      setTestLoading(false);
    }
  };

  const selectedProviderData = providers.find(p => p.id === selectedProvider);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8" />
            AI Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage AI providers (GPT, Gemini, Claude) and test their APIs
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProviders} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showAddProvider} onOpenChange={setShowAddProvider}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add AI Provider</DialogTitle>
                <DialogDescription>
                  Configure a new AI provider (OpenAI, Google Gemini, Anthropic Claude, etc.)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Provider Name *</Label>
                    <Select onValueChange={(value) => {
                      const selectedModels = providerModels[value as keyof typeof providerModels] || [];
                      setNewProvider({
                        ...newProvider, 
                        name: value,
                        models: selectedModels,
                        defaultModel: selectedModels[0] || ''
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="claude">Anthropic Claude</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      placeholder="e.g., OpenAI GPT-4"
                      value={newProvider.displayName}
                      onChange={(e) => setNewProvider({...newProvider, displayName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={newProvider.apiKey}
                    onChange={(e) => setNewProvider({...newProvider, apiKey: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="baseUrl">Base URL (optional)</Label>
                  <Input
                    id="baseUrl"
                    placeholder="Custom API endpoint"
                    value={newProvider.baseUrl}
                    onChange={(e) => setNewProvider({...newProvider, baseUrl: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="models">Available Models</Label>
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-muted/50">
                    {newProvider.models.length > 0 ? (
                      newProvider.models.map((model) => (
                        <Badge key={model} variant="outline">
                          {model}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Select a provider to see available models</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultModel">Default Model</Label>
                    <Select 
                      onValueChange={(value) => setNewProvider({...newProvider, defaultModel: value})}
                      value={newProvider.defaultModel}
                      disabled={newProvider.models.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose default model" />
                      </SelectTrigger>
                      <SelectContent>
                        {newProvider.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={newProvider.temperature}
                      onChange={(e) => setNewProvider({...newProvider, temperature: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddProvider(false)}>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tokens Used</p>
                <p className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${stats.totalCost.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
          <TabsTrigger value="test">Test API</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          {/* Providers List */}
          <Card>
            <CardHeader>
              <CardTitle>Configured Providers</CardTitle>
              <CardDescription>
                Manage your AI provider configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Models</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{provider.displayName}</div>
                            <div className="text-sm text-muted-foreground">{provider.name}</div>
                          </div>
                        </div>
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
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {provider.apiKey}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {provider.testCount} tests
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.isActive ? "default" : "secondary"}>
                          {provider.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <TestTube className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {providers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No AI providers configured yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          {/* Test API */}
          <Card>
            <CardHeader>
              <CardTitle>Test AI API</CardTitle>
              <CardDescription>
                Test your AI providers before using them in production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Select Provider</Label>
                  <Select onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a provider to test" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model (optional)</Label>
                  <Select onValueChange={setSelectedModel} disabled={!selectedProviderData}>
                    <SelectTrigger>
                      <SelectValue placeholder="Use default model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProviderData?.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="prompt">Test Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your test prompt..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleTestProvider} 
                disabled={testLoading || !selectedProvider}
                className="w-full"
              >
                {testLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Test API
              </Button>

              {/* Test Result */}
              {testResult && (
                <Card className={testResult.success ? "border-green-200" : "border-red-200"}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      Test Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResult.success ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{testResult.responseTime}ms</span>
                          </div>
                          {testResult.tokensUsed && (
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{testResult.tokensUsed} tokens</span>
                            </div>
                          )}
                          {testResult.cost && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">${testResult.cost.toFixed(6)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label>Response:</Label>
                          <ScrollArea className="h-32 mt-2 p-3 border rounded-md bg-muted/50">
                            <pre className="text-sm whitespace-pre-wrap">{testResult.response}</pre>
                          </ScrollArea>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <strong>Error:</strong> {testResult.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Test Results History */}
          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
              <CardDescription>
                Recent API test results and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.slice(0, 10).map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.provider.displayName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.model}</Badge>
                      </TableCell>
                      <TableCell>
                        {result.success ? (
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.responseTime ? `${result.responseTime}ms` : '-'}
                      </TableCell>
                      <TableCell>
                        {result.tokensUsed || '-'}
                      </TableCell>
                      <TableCell>
                        {result.cost ? `$${result.cost.toFixed(6)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(result.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Test Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Prompt:</Label>
                                <div className="mt-1 p-3 border rounded-md bg-muted/50">
                                  <pre className="text-sm whitespace-pre-wrap">{result.prompt}</pre>
                                </div>
                              </div>
                              {result.success && result.response && (
                                <div>
                                  <Label>Response:</Label>
                                  <ScrollArea className="h-32 mt-1 p-3 border rounded-md bg-muted/50">
                                    <pre className="text-sm whitespace-pre-wrap">{result.response}</pre>
                                  </ScrollArea>
                                </div>
                              )}
                              {!result.success && result.error && (
                                <div>
                                  <Label>Error:</Label>
                                  <div className="mt-1 p-3 border rounded-md bg-red-50 text-red-700">
                                    {result.error}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {testResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No test results yet. Run your first API test above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
