// Utility functions for AI management

export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.0001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

export function formatTokens(tokens: number): string {
  if (tokens < 1000) return tokens.toString();
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(1)}M`;
}

export function formatResponseTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function getProviderColor(name: string): string {
  const colors: Record<string, string> = {
    openai: 'text-green-600',
    gemini: 'text-blue-600', 
    claude: 'text-purple-600',
    custom: 'text-gray-600'
  };
  return colors[name] || 'text-gray-600';
}

export function getSuccessRateColor(rate: number): string {
  if (rate >= 95) return 'text-green-600';
  if (rate >= 80) return 'text-yellow-600';
  return 'text-red-600';
}
