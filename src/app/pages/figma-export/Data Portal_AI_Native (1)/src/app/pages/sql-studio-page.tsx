import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { ChevronRight, ChevronDown, History, FileText, Database, BarChart3, Table, Search, Clock, Star, Users, Plus } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Badge } from '../components/ui/badge';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { Input } from '../components/ui/input';

interface QueryHistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

interface CatalogItem {
  id: string;
  name: string;
  type: 'table' | 'folder';
  children?: CatalogItem[];
}

interface SavedQuery {
  id: string;
  title: string;
  description: string;
  lastEdited: string;
  owner: string;
  shared: boolean;
}

const queryHistory: QueryHistoryItem[] = [
  { id: '1', title: 'Revenue by region and product', timestamp: '2m ago' },
  { id: '2', title: 'User analytics summary', timestamp: '1h ago' },
  { id: '3', title: 'Top products last 7 days', timestamp: 'Yesterday' },
];

const mockSavedQueries: SavedQuery[] = [
  {
    id: '1',
    title: 'Revenue by region and product',
    description: 'Aggregated revenue metrics by region',
    lastEdited: '2 hours ago',
    owner: 'Tony',
    shared: false,
  },
  {
    id: '2',
    title: 'Customer churn analysis',
    description: 'Monthly customer retention metrics',
    lastEdited: '1 day ago',
    owner: 'Tony',
    shared: true,
  },
  {
    id: '3',
    title: 'Delivery performance KPIs',
    description: 'Dasher efficiency and on-time metrics',
    lastEdited: '3 days ago',
    owner: 'Tony',
    shared: false,
  },
];

const catalogData: CatalogItem[] = [
  {
    id: 'catalog',
    name: 'CATALOG AND METRICS P&P-ORDER',
    type: 'folder',
    children: [
      { id: 'warehouse', name: 'warehouse', type: 'folder' },
      { id: 'analytics', name: 'analytics', type: 'folder' },
      { id: 'fact_orders', name: 'fact_orders', type: 'table' },
      { id: 'dim_region', name: 'dim_region', type: 'table' },
      { id: 'dim_product', name: 'dim_product', type: 'table' },
    ],
  },
];

const sampleResults = [
  { region_name: 'West', product_name: 'Premium', total_revenue: 125430.00, order_count: 342 },
  { region_name: 'East', product_name: 'Standard', total_revenue: 98210.50, order_count: 521 },
];

const aiSuggestions = [
  {
    id: '1',
    title: 'Generate the query for revenue by region and product',
    description: 'Here\'s a query for revenue by region and product using `fact_orders`, `dim_region`, and `dim_product`. It aggregates total revenue and order count for each region-product combination for the last 30 days. I\'ve added it to your editor.',
    action: 'Restore to this step',
    type: 'generated',
  },
  {
    id: '2',
    title: 'Optimize my query to use jediregion datasets',
    description: 'I can rewrite your query to use the `jediregion` datasets. Use `jediregion.fact_orders` and `jediregion.dim_region` instead of the warehouse tables for better performance. Should I apply this change to your editor?',
    action: 'Optimize my query to use jediregion datasets',
    type: 'optimization',
  },
  {
    id: '3',
    title: 'Add a filter for last 90 days',
    description: 'Add WHERE order_date > DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY) to restrict to the last 90 days. I can insert this into your current query if you\'d like.',
    action: 'Add a filter for last 90 days',
    type: 'enhancement',
  },
  {
    id: '4',
    title: 'Apply recommendation: Refactor with the SGT tables',
    description: 'I can help you refactor this query to use the SGT (Single Ground Truth) tables for better data consistency and performance.',
    action: 'Apply recommendation: Refactor with the SGT tables',
    type: 'recommendation',
  },
];

export function SQLStudioPage() {
  const [showLanding, setShowLanding] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [sql, setSql] = useState(`-- Revenue by region and product
SELECT
  r.region_name,
  p.product_name,
  SUM(f.revenue) AS total_revenue,
  COUNT(DISTINCT f.order_id) AS order_count
FROM fact_orders f JOIN
JOIN dim_region r ON f.region_id = r.region_id
JOIN dim_product p ON f.product_id = p.product_id
WHERE f.order_date > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY r.region_name, p.product_name
ORDER BY total_revenue DESC
LIMIT 100;`);
  const [results, setResults] = useState<any[]>([]);
  const [expandedCatalog, setExpandedCatalog] = useState<Record<string, boolean>>({ catalog: true });
  const [activeTab, setActiveTab] = useState<'results' | 'chart' | 'messages'>('results');

  const filteredQueries = mockSavedQueries.filter((query) => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'mine') return matchesSearch && !query.shared;
    if (filter === 'shared') return matchesSearch && query.shared;
    return matchesSearch;
  });

  useEffect(() => {
    const artifact = JSON.parse(sessionStorage.getItem('sqlStudioArtifact') || 'null');
    if (artifact?.sql) {
      setSql(artifact.sql);
    }
  }, []);

  const handleRun = () => {
    setResults(sampleResults);
    setActiveTab('results');
  };

  const toggleCatalogItem = (id: string) => {
    setExpandedCatalog(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Landing Page View
  if (showLanding) {
    return (
      <div className="h-full flex overflow-hidden">
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6" style={{ color: '#FF3A00' }} />
                <h1 className="text-2xl" style={{ color: '#FF3A00' }}>SQL Studio</h1>
              </div>
              <p className="text-gray-600">
                Create and manage SQL queries. Open a query to edit or start a new one
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
              <Button
                style={{ backgroundColor: '#FF3A00' }}
                className="text-white gap-2"
                onClick={() => setShowLanding(false)}
              >
                <Plus className="w-4 h-4" />
                New Query
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                className={filter === 'all' ? 'bg-gray-100 text-gray-900' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={filter === 'mine' ? 'bg-gray-100 text-gray-900' : ''}
                onClick={() => setFilter('mine')}
              >
                My Queries
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={filter === 'shared' ? 'bg-gray-100 text-gray-900' : ''}
                onClick={() => setFilter('shared')}
              >
                Shared with me
              </Button>
            </div>

            {/* Queries Grid */}
            {filteredQueries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQueries.map((query) => (
                  <div
                    key={query.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setShowLanding(false)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-gray-400" />
                        <h3 className="font-medium text-gray-900">{query.title}</h3>
                      </div>
                      {query.shared && (
                        <Users className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{query.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{query.lastEdited}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">No queries found</p>
                <Button
                  style={{ backgroundColor: '#FF3A00' }}
                  className="text-white gap-2"
                  onClick={() => setShowLanding(false)}
                >
                  <Plus className="w-4 h-4" />
                  Create your first query
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Assistant */}
        <AIAssistantSidebar 
          title="SQL Assistant"
          welcomeMessage="Hi! I can help you write and execute SQL Queries, explain existing SQL Code, search for tables/metrics/queries"
          suggestions={[
            { text: 'Write a revenue query' },
            { text: 'Explain this SQL' },
            { text: 'Find customer tables' },
            { text: 'Optimize my query' },
          ]}
        />
      </div>
    );
  }

  // Query Editor View
  return (
    <div className="h-full flex overflow-hidden bg-white">
      {/* Left Sidebar - Query History & Catalog */}
      <div className="w-64 border-r border-gray-200 flex flex-col overflow-hidden bg-gray-50">
        {/* Query History */}
        <div className="border-b border-gray-200">
          <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Query History</span>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-xs">×</span>
            </button>
          </div>
          <div className="p-2">
            {queryHistory.map((item) => (
              <div
                key={item.id}
                className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer mb-1"
              >
                <div className="text-sm text-gray-900">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="text-xs font-medium text-gray-900 mb-2">CATALOG AND METRICS P&P-ORDER</div>
            <div className="flex items-center gap-2 mb-2">
              <select className="text-xs border border-gray-300 rounded px-2 py-1 flex-1">
                <option>warehouse</option>
              </select>
              <select className="text-xs border border-gray-300 rounded px-2 py-1 flex-1">
                <option>Metrics pack</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Search tables or metrics"
              className="text-xs w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="p-2">
            {catalogData.map((item) => (
              <div key={item.id}>
                <div
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => toggleCatalogItem(item.id)}
                >
                  {item.children && (
                    expandedCatalog[item.id] ? (
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-500" />
                    )
                  )}
                  <span className="text-xs text-gray-700">{item.name}</span>
                </div>
                {item.children && expandedCatalog[item.id] && (
                  <div className="ml-4">
                    {item.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        {child.type === 'folder' ? (
                          <ChevronRight className="w-3 h-3 text-gray-500" />
                        ) : (
                          <Table className="w-3 h-3 text-gray-500" />
                        )}
                        <span className="text-xs text-gray-700">{child.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Tabs and Actions */}
        <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <div className="px-3 py-1.5 bg-gray-100 rounded text-sm font-mono text-gray-700">
              query.sql
            </div>
            <div className="px-3 py-1.5 text-sm font-mono text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
              revenue_report.sql
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
              <option>Snowflake</option>
            </select>
            <Button
              size="sm"
              style={{ backgroundColor: '#6366F1' }}
              className="text-white"
            >
              Share
            </Button>
            <Button
              size="sm"
              style={{ backgroundColor: '#6366F1' }}
              className="text-white"
            >
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
            >
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Editor and Results Split */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Monaco Editor */}
          <div className="h-1/2 border-b border-gray-200">
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={sql}
              onChange={(value) => setSql(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Results Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Recommendations Banner */}
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="text-xs font-medium text-gray-700 mb-2">Recommendation</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-xs text-gray-700">Low confidence SQL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-xs text-gray-700">Stale table detected: <span className="font-mono">fact_orders</span></span>
                  <button className="text-xs text-blue-600 hover:underline">×</button>
                </div>
                <button className="ml-auto text-xs text-blue-600 hover:underline">
                  Refactor with the SGT tables for Revenue data →
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('results')}
                className={`text-sm pb-2 border-b-2 ${
                  activeTab === 'results'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Results
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`text-sm pb-2 border-b-2 ${
                  activeTab === 'chart'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Chart
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`text-sm pb-2 border-b-2 ${
                  activeTab === 'messages'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Messages
              </button>
              <Button
                size="sm"
                style={{ backgroundColor: '#6366F1' }}
                className="text-white ml-auto"
                onClick={handleRun}
              >
                Run
              </Button>
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-auto p-4">
              {results.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="text-left py-2 px-4 font-medium text-gray-700">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        {Object.values(row).map((value: any, j) => (
                          <td key={j} className="py-2 px-4 text-gray-900">
                            {typeof value === 'number' && value % 1 !== 0
                              ? value.toFixed(2)
                              : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  Run a query to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - SQL AI Agent */}
      <AIAssistantSidebar 
        title="SQL Assistant"
        welcomeMessage="Hi! I can help you write and execute SQL Queries, explain existing SQL Code, search for tables/metrics/queries"
        suggestions={[
          { text: 'Write a revenue query' },
          { text: 'Explain this SQL' },
          { text: 'Find customer tables' },
          { text: 'Optimize my query' },
        ]}
      />
    </div>
  );
}