import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Filter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface Metric {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'verified' | 'pending' | 'deprecated';
  category: string;
  lastUpdated: string;
}

const mockMetrics: Metric[] = [
  {
    id: '1',
    name: 'dasher_cancellation_rate',
    description: 'Percentage of deliveries cancelled by dashers',
    owner: 'Ops Team',
    status: 'verified',
    category: 'Operations',
    lastUpdated: '2024-03-10',
  },
  {
    id: '2',
    name: 'merchant_onboarding_rate',
    description: 'Rate of successful merchant onboarding per week',
    owner: 'Growth Team',
    status: 'verified',
    category: 'Growth',
    lastUpdated: '2024-03-08',
  },
  {
    id: '3',
    name: 'delivery_latency_p95',
    description: '95th percentile delivery time from order to delivery',
    owner: 'Logistics Team',
    status: 'pending',
    category: 'Logistics',
    lastUpdated: '2024-03-11',
  },
  {
    id: '4',
    name: 'cx_satisfaction_score',
    description: 'Customer satisfaction score based on post-delivery surveys',
    owner: 'CX Team',
    status: 'verified',
    category: 'Customer Experience',
    lastUpdated: '2024-03-09',
  },
  {
    id: '5',
    name: 'order_conversion_rate',
    description: 'Percentage of cart views that convert to completed orders',
    owner: 'Product Team',
    status: 'verified',
    category: 'Product',
    lastUpdated: '2024-03-07',
  },
  {
    id: '6',
    name: 'legacy_merchant_gmv',
    description: 'Gross merchandise value (deprecated - use merchant_gmv_v2)',
    owner: 'Finance Team',
    status: 'deprecated',
    category: 'Finance',
    lastUpdated: '2023-12-15',
  },
];

export function MetricRegistryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'deprecated'>('all');

  const filteredMetrics = mockMetrics.filter((metric) => {
    const matchesSearch =
      metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      metric.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      metric.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || metric.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'deprecated':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      verified: { bg: 'bg-green-100', text: 'text-green-700' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      deprecated: { bg: 'bg-red-100', text: 'text-red-700' },
    };

    const variant = variants[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${variant.bg} ${variant.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Metric Registry</h1>
          <p className="text-gray-600">
            Central repository for all verified metrics and definitions across DoorDash
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search metrics by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button style={{ backgroundColor: '#FF3A00' }} className="text-white">
            + New Metric
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            style={statusFilter === 'all' ? { backgroundColor: '#FF3A00' } : {}}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'verified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('verified')}
            style={statusFilter === 'verified' ? { backgroundColor: '#FF3A00' } : {}}
          >
            Verified
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
            style={statusFilter === 'pending' ? { backgroundColor: '#FF3A00' } : {}}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'deprecated' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('deprecated')}
            style={statusFilter === 'deprecated' ? { backgroundColor: '#FF3A00' } : {}}
          >
            Deprecated
          </Button>
        </div>

        {/* Metrics Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMetrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="text-sm font-mono text-gray-900">{metric.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{metric.description}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline">{metric.category}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{metric.owner}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(metric.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{metric.lastUpdated}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMetrics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No metrics found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
