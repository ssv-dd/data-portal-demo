import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ChevronRight, ChevronDown, ChevronUp, Database, Table, Search, Clock, Users, Plus, Play, Share2, BookmarkPlus, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Send, Sparkles, MessageSquare, X, BookOpen, ArrowUp, Folder, FolderOpen, FilePlus, BarChart3, Maximize2, Minimize2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { mockSavedQueries, sampleResults, DEFAULT_SQL } from '../data/mock/sql-studio-data';

const knowledgeBases = [
  { id: 'default', name: 'Default SQL Skills', description: 'Core SQL syntax, joins, aggregations, window functions' },
  { id: 'analytics', name: 'Analytics SQL Skills', description: 'DoorDash analytics patterns, metric definitions, reporting' },
  { id: 'wolt', name: 'Wolt SQL Skills', description: 'Wolt-specific schemas, tables, and query patterns' },
];

const queryHistoryGrouped = {
  recent: [
    { id: '1', title: 'Revenue by region and product', timestamp: '2m ago' },
    { id: '2', title: 'User analytics summary', timestamp: '1h ago' },
    { id: '3', title: 'Top products last 7 days', timestamp: '3h ago' },
  ],
  folders: [
    {
      id: 'f1', name: 'Revenue Reports', items: [
        { id: '10', title: 'Q1 revenue breakdown', timestamp: '2d ago' },
        { id: '11', title: 'Revenue by merchant tier', timestamp: '4d ago' },
        { id: '12', title: 'MoM revenue growth', timestamp: '1w ago' },
      ],
    },
    {
      id: 'f2', name: 'Delivery Metrics', items: [
        { id: '20', title: 'Courier efficiency by zone', timestamp: '1d ago' },
        { id: '21', title: 'Avg delivery time trend', timestamp: '3d ago' },
      ],
    },
    {
      id: 'f3', name: 'Customer Analytics', items: [
        { id: '30', title: 'Churn cohort analysis', timestamp: '5d ago' },
        { id: '31', title: 'DashPass retention rates', timestamp: '1w ago' },
      ],
    },
    {
      id: 'f4', name: 'Saved Queries', items: [
        { id: '40', title: 'Revenue by region and product', timestamp: '2h ago' },
        { id: '41', title: 'Customer churn analysis', timestamp: '1d ago' },
        { id: '42', title: 'Delivery performance KPIs', timestamp: '3d ago' },
        { id: '43', title: 'DashPass conversion funnel', timestamp: '5h ago' },
        { id: '44', title: 'Merchant GMV ranking', timestamp: '1d ago' },
      ],
    },
  ],
};

const pastConversationsGrouped = {
  recent: [
    { id: '1', title: 'Revenue query optimization', preview: 'How can I optimize this JOIN...', timestamp: '2h ago', messages: 4 },
    { id: '2', title: 'Customer churn SQL help', preview: 'Write a query to find churned...', timestamp: '1d ago', messages: 6 },
  ],
  folders: [
    {
      id: 'cf1', name: 'Query Optimization', items: [
        { id: '10', title: 'Index usage analysis', preview: 'Why is my query not using...', timestamp: '3d ago', messages: 5 },
        { id: '11', title: 'Partition pruning tips', preview: 'How to leverage partitions...', timestamp: '5d ago', messages: 3 },
      ],
    },
    {
      id: 'cf2', name: 'Schema Questions', items: [
        { id: '20', title: 'Table schema exploration', preview: 'What columns are in fact_orders...', timestamp: '2d ago', messages: 3 },
        { id: '21', title: 'Relationship between dims', preview: 'How do dim_region and dim_product...', timestamp: '4d ago', messages: 7 },
      ],
    },
    {
      id: 'cf3', name: 'SQL Patterns', items: [
        { id: '30', title: 'Window functions help', preview: 'How do I use ROW_NUMBER...', timestamp: '5d ago', messages: 5 },
        { id: '31', title: 'Date filtering best practices', preview: 'What is the best way to filter...', timestamp: '1w ago', messages: 8 },
      ],
    },
  ],
};

const catalogBrowse = {
  topics: [
    {
      id: 'finance',
      name: 'Finance',
      items: [
        { id: 'ft1', name: 'fact_revenue' },
        { id: 'ft2', name: 'dim_cost_center' },
        { id: 'ft3', name: 'fact_payments' },
        { id: 'ft4', name: 'fact_invoices' },
      ],
    },
    {
      id: 'merchant',
      name: 'Merchant',
      items: [
        { id: 'mt1', name: 'dim_merchant' },
        { id: 'mt2', name: 'fact_merchant_gmv' },
        { id: 'mt3', name: 'fact_merchant_ratings' },
        { id: 'mt4', name: 'dim_merchant_tier' },
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing',
      items: [
        { id: 'mkt1', name: 'fact_campaigns' },
        { id: 'mkt2', name: 'dim_channel' },
        { id: 'mkt3', name: 'fact_attribution' },
      ],
    },
    {
      id: 'delivery',
      name: 'Delivery',
      items: [
        { id: 'dt1', name: 'fact_deliveries' },
        { id: 'dt2', name: 'dim_dasher' },
        { id: 'dt3', name: 'fact_delivery_times' },
        { id: 'dt4', name: 'dim_delivery_zone' },
      ],
    },
    {
      id: 'customer',
      name: 'Customer',
      items: [
        { id: 'ct1', name: 'dim_customer' },
        { id: 'ct2', name: 'fact_orders' },
        { id: 'ct3', name: 'fact_churn' },
        { id: 'ct4', name: 'dim_dashpass' },
      ],
    },
  ],
  metrics: [
    {
      id: 'guardrails',
      name: 'Guardrails',
      items: [
        { id: 'g1', name: 'P99 delivery time' },
        { id: 'g2', name: 'Error rate threshold' },
        { id: 'g3', name: 'Customer satisfaction floor' },
      ],
    },
    {
      id: 'capital_okrs',
      name: 'Capital OKRs',
      items: [
        { id: 'o1', name: 'CAC payback period' },
        { id: 'o2', name: 'LTV:CAC ratio' },
        { id: 'o3', name: 'Gross margin %' },
      ],
    },
    {
      id: 'revenue_metrics',
      name: 'Revenue',
      items: [
        { id: 'r1', name: 'Total GMV' },
        { id: 'r2', name: 'Net revenue' },
        { id: 'r3', name: 'ARPU' },
        { id: 'r4', name: 'Take rate' },
      ],
    },
  ],
};

export function SQLStudioPage() {
  const [showLanding, setShowLanding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [results, setResults] = useState<Record<string, any>[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runTime, setRunTime] = useState<string | null>(null);
  const [expandedCatalogBrowse, setExpandedCatalogBrowse] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'results' | 'chart' | 'messages'>('results');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftPanelTab, setLeftPanelTab] = useState<'history' | 'catalog'>('catalog');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'past'>('chat');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedHistoryFolders, setExpandedHistoryFolders] = useState<Record<string, boolean>>({});
  const [expandedChatFolders, setExpandedChatFolders] = useState<Record<string, boolean>>({});
  const [kbDropdownOpen, setKbDropdownOpen] = useState(false);
  const [selectedKb, setSelectedKb] = useState(knowledgeBases[0]);
  const [chatInput, setChatInput] = useState('');
  const [centerExpanded, setCenterExpanded] = useState<'none' | 'editor' | 'results'>('none');

  // Tab management
  const [sqlTabs, setSqlTabs] = useState<{ id: string; name: string; sql: string }[]>([
    { id: 'tab-1', name: 'query.sql', sql: DEFAULT_SQL },
    { id: 'tab-2', name: 'revenue_report.sql', sql: '' },
  ]);
  const [activeFileTab, setActiveFileTab] = useState('tab-1');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const kbDropdownRef = useRef<HTMLDivElement>(null);
  const kbButtonRef = useRef<HTMLButtonElement>(null);

  // Focus input when editing a tab name
  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTabId]);

  const addNewTab = useCallback(() => {
    const newId = `tab-${Date.now()}`;
    setSqlTabs(prev => [...prev, { id: newId, name: 'untitled.sql', sql: '' }]);
    setActiveFileTab(newId);
    setSql('');
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setSqlTabs(prev => {
      const next = prev.filter(t => t.id !== tabId);
      if (next.length === 0) {
        const fallback = { id: `tab-${Date.now()}`, name: 'untitled.sql', sql: '' };
        setActiveFileTab(fallback.id);
        setSql('');
        return [fallback];
      }
      if (activeFileTab === tabId) {
        const idx = prev.findIndex(t => t.id === tabId);
        const newActive = next[Math.min(idx, next.length - 1)];
        setActiveFileTab(newActive.id);
        setSql(newActive.sql);
      }
      return next;
    });
  }, [activeFileTab]);

  const switchTab = useCallback((tabId: string) => {
    // Save current tab's SQL
    setSqlTabs(prev => prev.map(t => t.id === activeFileTab ? { ...t, sql } : t));
    const target = sqlTabs.find(t => t.id === tabId);
    if (target) {
      setActiveFileTab(tabId);
      setSql(target.sql);
    }
  }, [activeFileTab, sql, sqlTabs]);

  const startRenaming = useCallback((tabId: string, currentName: string) => {
    setEditingTabId(tabId);
    setEditingTabName(currentName);
  }, []);

  const commitRename = useCallback(() => {
    if (editingTabId) {
      let name = editingTabName.trim();
      if (!name) name = 'untitled.sql';
      if (!name.endsWith('.sql')) name += '.sql';
      setSqlTabs(prev => prev.map(t => t.id === editingTabId ? { ...t, name } : t));
      setEditingTabId(null);
    }
  }, [editingTabId, editingTabName]);

  // Close KB dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        kbDropdownRef.current && !kbDropdownRef.current.contains(target) &&
        kbButtonRef.current && !kbButtonRef.current.contains(target)
      ) {
        setKbDropdownOpen(false);
      }
    }
    if (kbDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [kbDropdownOpen]);

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

  if (showLanding) {
    return (
      <div className="h-full flex overflow-hidden">
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-6 h-6 text-dd-primary" />
                  <h1 className="text-2xl text-dd-primary">SQL Studio</h1>
                </div>
                <p className="text-muted-foreground">
                  Create and manage SQL queries. Open a query to edit or start a new one
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/60"
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
              <Button variant="outline" size="sm" className={filter === 'all' ? 'bg-muted text-foreground' : ''} onClick={() => setFilter('all')}>All</Button>
              <Button variant="outline" size="sm" className={filter === 'mine' ? 'bg-muted text-foreground' : ''} onClick={() => setFilter('mine')}>My Queries</Button>
              <Button variant="outline" size="sm" className={filter === 'shared' ? 'bg-muted text-foreground' : ''} onClick={() => setFilter('shared')}>Shared with me</Button>
            </div>

            {filteredQueries.length > 0 ? (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQueries.map((query) => (
                  <motion.div variants={staggerItem} key={query.id}>
                    <div
                      className="bg-white border border-border/60 rounded-2xl p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
                      onClick={() => setShowLanding(false)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-muted-foreground/60" />
                          <h3 className="font-medium text-foreground">{query.title}</h3>
                        </div>
                        {query.shared && <Users className="w-4 h-4 text-muted-foreground/60" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{query.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{query.lastEdited}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-muted/50 rounded-2xl">
                <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
                <p className="text-muted-foreground mb-4">No queries found</p>
                <Button className="bg-dd-primary text-white gap-2" onClick={() => setShowLanding(false)}>
                  <Plus className="w-4 h-4" />
                  Create your first query
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - AI Assistant (simplified for landing) */}
        <div className="w-[440px] border-l border-border/60 flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-3 border-b border-border/60">
            <h3 className="font-medium text-foreground">SQL Assistant</h3>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto px-4 py-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dd-primary/10 to-dd-primary/5 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-dd-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">SQL Assistant</h3>
                <p className="text-xs text-muted-foreground text-center max-w-[240px] leading-relaxed mb-6">
                  I can help you write SQL queries, explain code, and search for tables and metrics.
                </p>
                <div className="w-full space-y-2">
                  {[
                    'Write a revenue query by region',
                    'Explain the current SQL',
                    'Find customer-related tables',
                    'Optimize my query performance',
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setShowLanding(false)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border/60 bg-white text-foreground text-xs text-left hover:bg-muted/50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="border border-border rounded-xl bg-white overflow-hidden">
                <div className="px-3 pt-2.5 flex items-center gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/70 text-xs text-foreground">
                    <BookOpen className="w-3 h-3 text-muted-foreground" />
                    <span>Default SQL Skills</span>
                  </div>
                </div>
                <textarea
                  placeholder="Ask about SQL, tables, or metrics..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm text-foreground bg-transparent placeholder-muted-foreground/50 focus:outline-none resize-none"
                />
                <div className="px-3 pb-2.5 flex items-center justify-between">
                  <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-muted text-muted-foreground/40">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Premium Editor View ───────────────────────────────────────────────
  return (
    <div className="h-full flex overflow-hidden p-2 gap-2 bg-gradient-to-br from-[#f8f9fb] via-[#f3f4f8] to-[#eef1f5]">
      {/* ── Left Panel ── */}
      {leftPanelOpen ? (
        <div className="w-72 rounded-2xl glass-panel flex flex-col overflow-hidden transition-all duration-200">
          {/* Header */}
          <div className="h-12 flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-full bg-foreground/[0.04]">
              {(['history', 'catalog'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftPanelTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all duration-200 ${
                    leftPanelTab === tab
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'history' ? (
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> History</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> Catalog</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLeftPanelOpen(false)}
              className="p-1.5 rounded-xl hover:bg-foreground/[0.05] text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {leftPanelTab === 'history' ? (
              <div className="p-2">
                <div className="px-2 py-2">
                  <input
                    type="text"
                    placeholder="Search history..."
                    className="text-xs w-full rounded-xl px-3 py-2 bg-foreground/[0.04] placeholder-muted-foreground/50 focus:outline-none focus:bg-foreground/[0.06] transition-colors duration-200 border-0"
                  />
                </div>

                <div className="px-2 pt-3 pb-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Recent</span>
                </div>
                {queryHistoryGrouped.recent.map((item) => (
                  <div key={item.id} className="px-3 py-2.5 hover:bg-foreground/[0.04] rounded-xl cursor-pointer mb-0.5 transition-all duration-150">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-foreground truncate">{item.title}</div>
                        <div className="text-[10px] text-muted-foreground/50 mt-0.5">{item.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="px-2 pt-5 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Folders</span>
                  <button className="p-1 rounded-lg hover:bg-foreground/[0.05] text-muted-foreground/40 hover:text-muted-foreground transition-all duration-200" title="New folder">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {queryHistoryGrouped.folders.map((folder) => (
                  <div key={folder.id}>
                    <button
                      onClick={() => setExpandedHistoryFolders(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-foreground/[0.04] rounded-xl cursor-pointer transition-all duration-150"
                    >
                      {expandedHistoryFolders[folder.id]
                        ? <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        : <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      }
                      <span className="text-xs font-medium text-foreground">{folder.name}</span>
                      <span className="text-[10px] text-muted-foreground/40 ml-auto">{folder.items.length}</span>
                      {expandedHistoryFolders[folder.id]
                        ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" />
                        : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                      }
                    </button>
                    {expandedHistoryFolders[folder.id] && (
                      <div className="ml-5 pl-3 border-l border-foreground/[0.06]">
                        {folder.items.map((item) => (
                          <div key={item.id} className="px-2 py-2 hover:bg-foreground/[0.04] rounded-xl cursor-pointer mb-0.5 transition-all duration-150">
                            <div className="text-xs text-foreground truncate">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground/50 mt-0.5">{item.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                    <input
                      type="text"
                      placeholder="Search tables or metrics..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="text-xs w-full rounded-xl pl-8 pr-3 py-2 bg-foreground/[0.04] placeholder-muted-foreground/50 focus:outline-none focus:bg-foreground/[0.06] transition-colors duration-200 border-0"
                    />
                  </div>
                </div>

                <div className="p-2">
                  <div className="px-2 pt-2 pb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Source of Truth Datasets</span>
                  </div>
                  {catalogBrowse.topics.map((topic) => (
                    <div key={topic.id}>
                      <button
                        onClick={() => setExpandedCatalogBrowse(prev => ({ ...prev, [topic.id]: !prev[topic.id] }))}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-foreground/[0.04] rounded-xl cursor-pointer transition-all duration-150"
                      >
                        {expandedCatalogBrowse[topic.id]
                          ? <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          : <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        }
                        <span className="text-xs font-medium text-foreground">{topic.name}</span>
                        <span className="text-[10px] text-muted-foreground/40 ml-auto">{topic.items.length}</span>
                        {expandedCatalogBrowse[topic.id]
                          ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" />
                          : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                        }
                      </button>
                      {expandedCatalogBrowse[topic.id] && (
                        <div className="ml-5 pl-3 border-l border-foreground/[0.06]">
                          {topic.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 px-2 py-2 hover:bg-foreground/[0.04] rounded-xl cursor-pointer mb-0.5 transition-all duration-150">
                              <Table className="w-3 h-3 text-muted-foreground/40" />
                              <span className="text-xs text-foreground font-mono">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="px-2 pt-5 pb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Metrics</span>
                  </div>
                  {catalogBrowse.metrics.map((group) => (
                    <div key={group.id}>
                      <button
                        onClick={() => setExpandedCatalogBrowse(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-foreground/[0.04] rounded-xl cursor-pointer transition-all duration-150"
                      >
                        {expandedCatalogBrowse[group.id]
                          ? <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          : <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        }
                        <span className="text-xs font-medium text-foreground">{group.name}</span>
                        <span className="text-[10px] text-muted-foreground/40 ml-auto">{group.items.length}</span>
                        {expandedCatalogBrowse[group.id]
                          ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" />
                          : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                        }
                      </button>
                      {expandedCatalogBrowse[group.id] && (
                        <div className="ml-5 pl-3 border-l border-foreground/[0.06]">
                          {group.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 px-2 py-2 hover:bg-foreground/[0.04] rounded-xl cursor-pointer mb-0.5 transition-all duration-150">
                              <BarChart3 className="w-3 h-3 text-muted-foreground/40" />
                              <span className="text-xs text-foreground">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-11 rounded-2xl glass-panel-subtle flex flex-col items-center pt-3 transition-all duration-200">
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="p-2 rounded-xl hover:bg-foreground/[0.05] text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Open sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Center: Editor + Results ── */}
      <div className="flex-1 flex flex-col gap-2 min-w-0 overflow-hidden">
        {/* Editor Card */}
        {centerExpanded !== 'results' && (
        <div className={`${centerExpanded === 'editor' ? 'flex-1' : 'flex-1'} min-h-0 flex flex-col rounded-2xl glass-panel overflow-hidden`}>
          {/* Tab Bar */}
          <div className="h-12 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-1 min-w-0 overflow-x-auto">
              {sqlTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`group relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all duration-200 shrink-0 ${
                    activeFileTab === tab.id
                      ? 'bg-foreground/[0.05] text-foreground'
                      : 'text-muted-foreground/60 hover:bg-foreground/[0.03]'
                  }`}
                  onClick={() => switchTab(tab.id)}
                  onDoubleClick={() => startRenaming(tab.id, tab.name)}
                >
                  {editingTabId === tab.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingTabName}
                      onChange={(e) => setEditingTabName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') setEditingTabId(null);
                      }}
                      className="bg-transparent border-0 outline-none text-xs font-mono w-[120px] px-0 py-0 text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate max-w-[140px]">{tab.name}</span>
                  )}
                  {sqlTabs.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-foreground/[0.08] text-muted-foreground/40 hover:text-muted-foreground transition-all duration-150 -mr-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addNewTab}
                className="p-1 rounded-lg hover:bg-foreground/[0.05] text-muted-foreground/40 hover:text-muted-foreground transition-all duration-200 ml-1 shrink-0"
                title="New query"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select className="text-xs rounded-xl px-3 py-1.5 bg-foreground/[0.04] text-foreground border-0 focus:outline-none transition-colors duration-200">
                <option>Snowflake</option>
                <option>BigQuery</option>
                <option>Redshift</option>
              </select>
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 rounded-xl border-foreground/[0.06] hover:bg-foreground/[0.04] transition-all duration-200">
                <BookmarkPlus className="w-3.5 h-3.5" /> Save
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5 rounded-xl border-foreground/[0.06] hover:bg-foreground/[0.04] transition-all duration-200">
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
              <button
                onClick={() => setCenterExpanded(prev => prev === 'editor' ? 'none' : 'editor')}
                className="p-1.5 rounded-xl hover:bg-foreground/[0.05] text-muted-foreground hover:text-foreground transition-all duration-200"
                title={centerExpanded === 'editor' ? 'Restore panes' : 'Expand editor'}
              >
                {centerExpanded === 'editor' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
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
        </div>
        )}

        {/* Results Card */}
        {centerExpanded !== 'editor' && (
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl glass-panel overflow-hidden">
          {/* Recommendation Banner */}
          <div className="mx-3 mt-3 px-4 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200/30">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-700 font-medium">Low confidence SQL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-700">Stale table: <code className="font-mono bg-amber-100/80 px-1.5 py-0.5 rounded-md">fact_orders</code></span>
              </div>
              <button className="ml-auto text-xs font-medium text-dd-primary hover:text-dd-primary/80 transition-colors duration-200">
                Refactor with SOT tables &rarr;
              </button>
            </div>
          </div>

          {/* Results Tabs + Run */}
          <div className="flex items-center px-4 py-2.5 shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-full bg-foreground/[0.04]">
              {(['results', 'chart', 'messages'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              {runTime && <span className="text-xs text-muted-foreground/50">{results.length} rows &middot; {runTime}</span>}
              <button
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground/85 text-white text-xs font-medium shadow-xs hover:bg-foreground hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
                onClick={handleRun}
                disabled={isRunning}
              >
                <Play className="w-3.5 h-3.5" />
                {isRunning ? 'Running...' : 'Run Query'}
              </button>
              <button
                onClick={() => setCenterExpanded(prev => prev === 'results' ? 'none' : 'results')}
                className="p-1.5 rounded-xl hover:bg-foreground/[0.05] text-muted-foreground hover:text-foreground transition-all duration-200"
                title={centerExpanded === 'results' ? 'Restore panes' : 'Expand results'}
              >
                {centerExpanded === 'results' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="flex-1 overflow-auto mx-3 mb-3 rounded-xl">
            {results.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#f0f1f4]/90 backdrop-blur-sm">
                  <tr>
                    <th className="text-left py-3 px-4 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider w-10">#</th>
                    {Object.keys(results[0]).map((key) => (
                      <th key={key} className="text-left py-3 px-4 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} className="hover:bg-foreground/[0.03] even:bg-foreground/[0.015] transition-colors duration-150">
                      <td className="py-2.5 px-4 text-muted-foreground/40 text-xs">{i + 1}</td>
                      {Object.values(row).map((value: any, j) => (
                        <td key={j} className="py-2.5 px-4 text-foreground font-mono text-xs">
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
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40">
                <div className="w-16 h-16 rounded-2xl bg-foreground/[0.03] flex items-center justify-center mb-4">
                  <Database className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-muted-foreground/60">Run a query to see results</p>
                <p className="text-xs mt-1.5 text-muted-foreground/40">Ctrl/Cmd + Enter</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* ── Right Panel: AI Assistant ── */}
      {rightPanelOpen ? (
        <div className="w-[440px] rounded-2xl glass-panel-chat flex flex-col overflow-hidden relative transition-all duration-200">
          {/* Header */}
          <div className="h-12 flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#6352af]/[0.06]">
              {(['chat', 'past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightPanelTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    rightPanelTab === tab
                      ? 'bg-white/90 text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'chat' ? (
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Chat</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Past Chats</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setRightPanelOpen(false)}
              className="p-1.5 rounded-xl hover:bg-[#6352af]/[0.06] text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Content */}
          {rightPanelTab === 'chat' ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat Messages Area */}
              <div className="flex-1 overflow-auto px-4 py-6 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6352af]/15 to-[#8b7fd4]/8 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-[#6352af]" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">SQL Assistant</h3>
                  <p className="text-xs text-muted-foreground/70 text-center max-w-[240px] leading-relaxed mb-6">
                    I can help you write SQL queries, explain code, and search for tables and metrics.
                  </p>
                  <div className="w-full space-y-2">
                    {[
                      'Write a revenue query by region',
                      'Explain the current SQL',
                      'Find customer-related tables',
                      'Optimize my query performance',
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(suggestion)}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border border-[#6352af]/[0.06] text-foreground text-xs text-left hover:bg-white/80 hover:border-[#6352af]/[0.12] hover:-translate-y-[1px] hover:shadow-sm transition-all duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Knowledge base dropdown */}
              {kbDropdownOpen && (
                <div ref={kbDropdownRef} className="absolute bottom-20 left-3 right-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_1px_rgba(0,0,0,0.08)] z-50 overflow-hidden">
                  <div className="px-4 py-3">
                    <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">Knowledge Bases</span>
                  </div>
                  {knowledgeBases.map((kb) => (
                    <button
                      key={kb.id}
                      onClick={() => {
                        setSelectedKb(kb);
                        setKbDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-foreground/[0.04] transition-all duration-200 flex items-start gap-3 ${
                        selectedKb.id === kb.id ? 'bg-foreground/[0.03]' : ''
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-foreground">{kb.name}</div>
                        <div className="text-[11px] text-muted-foreground/60 mt-0.5">{kb.description}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-foreground/[0.04]">
                    <button className="w-full px-4 py-3 text-left hover:bg-foreground/[0.04] transition-all duration-200 flex items-start gap-3">
                      <Plus className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-dd-primary">Add Custom SQL Skills</div>
                        <div className="text-[11px] text-muted-foreground/60 mt-0.5">Import .cursorrules, .mdc files, or paste custom SQL patterns</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="px-3 pb-3">
                <div className="rounded-2xl bg-white/50 border border-[#6352af]/[0.08] focus-within:border-[#6352af]/[0.2] focus-within:shadow-[0_0_0_3px_rgba(99,82,175,0.06)] transition-all duration-200">
                  {/* Text input */}
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about SQL, tables, or metrics..."
                    rows={2}
                    className="w-full px-3 pt-3 pb-2 text-sm text-foreground bg-transparent placeholder-muted-foreground/40 focus:outline-none resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        setChatInput('');
                      }
                    }}
                  />

                  {/* Bottom toolbar */}
                  <div className="px-3 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        ref={kbButtonRef}
                        onClick={() => setKbDropdownOpen(!kbDropdownOpen)}
                        className="p-2 rounded-xl hover:bg-[#6352af]/[0.06] text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200"
                        title="Add knowledge base"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6352af]/[0.07] text-xs text-foreground">
                        <BookOpen className="w-3 h-3 text-muted-foreground/60" />
                        <span>{selectedKb.name}</span>
                        <button
                          onClick={() => setSelectedKb(knowledgeBases[0])}
                          className="text-muted-foreground/40 hover:text-muted-foreground ml-0.5 transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        chatInput.trim()
                          ? 'bg-[#6352af] text-white hover:bg-[#5646a0] shadow-sm shadow-[#6352af]/20'
                          : 'bg-[#6352af]/[0.06] text-muted-foreground/30'
                      }`}
                      disabled={!chatInput.trim()}
                      onClick={() => setChatInput('')}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Past Conversations Tab */
            <div className="flex-1 overflow-auto">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="text-xs w-full rounded-xl pl-8 pr-3 py-2 bg-white/50 placeholder-muted-foreground/50 focus:outline-none focus:bg-white/70 transition-colors duration-200 border border-[#6352af]/[0.06]"
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="px-2 pt-2 pb-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Recent</span>
                </div>
                {pastConversationsGrouped.recent.map((conv) => (
                  <div
                    key={conv.id}
                    className="px-3 py-3 hover:bg-white/40 rounded-xl cursor-pointer mb-0.5 transition-all duration-150"
                  >
                    <div className="flex items-start justify-between mb-0.5">
                      <div className="text-xs font-medium text-foreground truncate pr-2">{conv.title}</div>
                      <span className="text-[10px] text-muted-foreground/50 shrink-0">{conv.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground/60 truncate">{conv.preview}</div>
                  </div>
                ))}

                <div className="px-2 pt-5 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Folders</span>
                  <button className="p-1 rounded-lg hover:bg-white/40 text-muted-foreground/40 hover:text-muted-foreground transition-all duration-200" title="New folder">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {pastConversationsGrouped.folders.map((folder) => (
                  <div key={folder.id}>
                    <button
                      onClick={() => setExpandedChatFolders(prev => ({ ...prev, [folder.id]: !prev[folder.id] }))}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/40 rounded-xl cursor-pointer transition-all duration-150"
                    >
                      {expandedChatFolders[folder.id]
                        ? <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        : <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      }
                      <span className="text-xs font-medium text-foreground">{folder.name}</span>
                      <span className="text-[10px] text-muted-foreground/40 ml-auto">{folder.items.length}</span>
                      {expandedChatFolders[folder.id]
                        ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" />
                        : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                      }
                    </button>
                    {expandedChatFolders[folder.id] && (
                      <div className="ml-5 pl-3 border-l border-[#6352af]/[0.08]">
                        {folder.items.map((item) => (
                          <div key={item.id} className="px-2 py-2.5 hover:bg-white/40 rounded-xl cursor-pointer mb-0.5 transition-all duration-150">
                            <div className="flex items-start justify-between mb-0.5">
                              <div className="text-xs text-foreground truncate pr-2">{item.title}</div>
                              <span className="text-[10px] text-muted-foreground/50 shrink-0">{item.timestamp}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground/60 truncate">{item.preview}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-11 rounded-2xl glass-panel-subtle bg-[#f5f3ff]/60 flex flex-col items-center pt-3 transition-all duration-200">
          <button
            onClick={() => setRightPanelOpen(true)}
            className="p-2 rounded-xl hover:bg-[#6352af]/[0.06] text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Open AI Assistant"
          >
            <PanelRightOpen className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
