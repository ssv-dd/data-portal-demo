import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ChevronRight, ChevronDown, Database, Table, Search, Clock, Users, Plus, Play, Share2, BookmarkPlus } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { mockSavedQueries, queryHistory, catalogData, sampleResults, DEFAULT_SQL } from '../data/mock/sql-studio-data';

export function SQLStudioPage() {
  const [showLanding, setShowLanding] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [results, setResults] = useState<Record<string, any>[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runTime, setRunTime] = useState<string | null>(null);
  const [expandedCatalog, setExpandedCatalog] = useState<Record<string, boolean>>({ catalog: true });
  const [activeTab, setActiveTab] = useState<'results' | 'chart' | 'messages'>('results');

  const filteredQueries = mockSavedQueries.filter((query) => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'mine') return matchesSearch && !query.shared;
    if (filter === 'shared') return matchesSearch && query.shared;
    return matchesSearch;
  });

  const handleRun = () => {
    setIsRunning(true);
    setResults([]);
    setTimeout(() => {
      setResults(sampleResults);
      setActiveTab('results');
      setRunTime('0.34s');
      setIsRunning(false);
    }, 800);
  };

  const toggleCatalogItem = (id: string) => {
    setExpandedCatalog(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (showLanding) {
    return (
      <div className="h-full flex overflow-hidden">
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6 text-dd-primary" />
                <h1 className="text-2xl text-dd-primary">SQL Studio</h1>
              </div>
              <p className="text-gray-600">
                Create and manage SQL queries. Open a query to edit or start a new one
              </p>
            </div>

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
                className="bg-dd-primary text-white gap-2"
                onClick={() => setShowLanding(false)}
              >
                <Plus className="w-4 h-4" />
                New Query
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Button variant="outline" size="sm" className={filter === 'all' ? 'bg-gray-100 text-gray-900' : ''} onClick={() => setFilter('all')}>All</Button>
              <Button variant="outline" size="sm" className={filter === 'mine' ? 'bg-gray-100 text-gray-900' : ''} onClick={() => setFilter('mine')}>My Queries</Button>
              <Button variant="outline" size="sm" className={filter === 'shared' ? 'bg-gray-100 text-gray-900' : ''} onClick={() => setFilter('shared')}>Shared with me</Button>
            </div>

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
                      {query.shared && <Users className="w-4 h-4 text-gray-400" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{query.description}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{query.lastEdited}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">No queries found</p>
                <Button className="bg-dd-primary text-white gap-2" onClick={() => setShowLanding(false)}>
                  <Plus className="w-4 h-4" />
                  Create your first query
                </Button>
              </div>
            )}
          </div>
        </div>

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

  return (
    <div className="h-full flex overflow-hidden bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col overflow-hidden bg-gray-50">
        <div className="border-b border-gray-200">
          <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Query History</span>
          </div>
          <div className="p-2">
            {queryHistory.map((item) => (
              <div key={item.id} className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer mb-0.5">
                <div className="text-sm text-gray-900 truncate">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Catalog</div>
            <div className="flex items-center gap-2 mb-2">
              <select className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 bg-white">
                <option>warehouse</option>
                <option>analytics</option>
              </select>
              <select className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 bg-white">
                <option>Metrics pack</option>
              </select>
            </div>
            <input type="text" placeholder="Search tables or metrics" className="text-xs w-full border border-gray-300 rounded px-2 py-1.5" />
          </div>

          <div className="p-2">
            {catalogData.map((item) => (
              <div key={item.id}>
                <div
                  className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => toggleCatalogItem(item.id)}
                >
                  {item.children && (expandedCatalog[item.id]
                    ? <ChevronDown className="w-3 h-3 text-gray-500" />
                    : <ChevronRight className="w-3 h-3 text-gray-500" />
                  )}
                  <Database className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-700 font-medium">{item.name}</span>
                </div>
                {item.children && expandedCatalog[item.id] && (
                  <div className="ml-4">
                    {item.children.map((child) => (
                      <div key={child.id} className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                        {child.type === 'folder'
                          ? <ChevronRight className="w-3 h-3 text-gray-400" />
                          : <Table className="w-3 h-3 text-gray-400" />
                        }
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

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Bar */}
        <div className="h-11 border-b border-gray-200 bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-mono text-gray-800 border border-gray-200">query.sql</div>
            <div className="px-3 py-1.5 text-xs font-mono text-gray-500 hover:bg-gray-50 rounded cursor-pointer">revenue_report.sql</div>
          </div>
          <div className="flex items-center gap-2">
            <select className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700">
              <option>Snowflake</option>
              <option>BigQuery</option>
              <option>Redshift</option>
            </select>
            <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5">
              <BookmarkPlus className="w-3.5 h-3.5" /> Save
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
          </div>
        </div>

        {/* Editor + Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
                padding: { top: 12 },
                renderLineHighlight: 'gutter',
              }}
            />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Recommendation Banner */}
            <div className="px-4 py-2 border-b border-gray-200 bg-amber-50">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-800">Low confidence SQL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-800">Stale table detected: <code className="font-mono bg-amber-100 px-1 rounded">fact_orders</code></span>
                </div>
                <button className="ml-auto text-xs font-medium hover:underline text-dd-primary">
                  Refactor with SGT tables →
                </button>
              </div>
            </div>

            {/* Results Tabs + Run */}
            <div className="flex items-center px-4 py-0 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {(['results', 'chart', 'messages'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm py-2.5 border-b-2 capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-gray-900 text-gray-900 font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                {runTime && <span className="text-xs text-gray-400">{results.length} rows · {runTime}</span>}
                <Button
                  size="sm"
                  className="bg-dd-primary text-white gap-1.5 text-xs h-7"
                  onClick={handleRun}
                  disabled={isRunning}
                >
                  <Play className="w-3.5 h-3.5" />
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
              </div>
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-auto">
              {results.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">#</th>
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-4 text-gray-400 text-xs">{i + 1}</td>
                        {Object.values(row).map((value: any, j) => (
                          <td key={j} className="py-2 px-4 text-gray-900 font-mono text-xs">
                            {typeof value === 'number'
                              ? value % 1 !== 0 ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value.toLocaleString()
                              : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Database className="w-10 h-10 mb-3 text-gray-300" />
                  <p className="text-sm">Run a query to see results</p>
                  <p className="text-xs mt-1">Ctrl/Cmd + Enter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
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
