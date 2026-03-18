import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Circle,
  Info,
  RotateCcw,
  Save,
  ChevronRight,
  ChevronDown,
  Settings,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface MetricOption {
  id: string;
  name: string;
  category: string;
  description: string;
  popular?: boolean;
  owner?: string;
  lastUpdated?: string;
  definition?: string;
  source?: string;
}

interface ProductAreaConfig {
  id: string;
  name: string;
  enabled: boolean;
  selectedMetrics: string[]; // metric IDs
}

interface ScorecardCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  currentConfig: ProductAreaConfig[];
  onSave: (config: ProductAreaConfig[]) => void;
  onChange?: (config: ProductAreaConfig[]) => void; // New: for live updates
}

// All available metrics organized by product area
const availableMetricsByArea: Record<string, MetricOption[]> = {
  company: [
    { 
      id: 'company-gov', 
      name: 'GOV (Gross Order Value)', 
      category: 'Financial', 
      description: 'Total value of all orders', 
      popular: true,
      owner: 'Finance Team',
      lastUpdated: '2024-02-15',
      definition: 'Gross Order Value (GOV) represents the total dollar value of all orders placed on the platform before any discounts, refunds, or cancellations. This is a primary indicator of marketplace activity and consumer demand.',
      source: 'Data Warehouse - orders.fact_orders'
    },
    { 
      id: 'company-revenue', 
      name: 'Revenue (Net)', 
      category: 'Financial', 
      description: 'Total net revenue', 
      popular: true,
      owner: 'Finance Team',
      lastUpdated: '2024-02-15',
      definition: 'Net Revenue is the total amount of money earned after deducting discounts, refunds, and cancellations from Gross Order Value.',
      source: 'Data Warehouse - finance.fact_revenue'
    },
    { 
      id: 'company-contribution', 
      name: 'Contribution Margin', 
      category: 'Financial', 
      description: 'Revenue minus variable costs', 
      popular: true,
      owner: 'Finance Team',
      lastUpdated: '2024-02-15',
      definition: 'Contribution Margin measures profitability by calculating Revenue minus all variable costs (delivery costs, payment processing, etc.).',
      source: 'Data Warehouse - finance.fact_contribution'
    },
    { 
      id: 'company-vp-order', 
      name: 'VP/order (unit economics)', 
      category: 'Financial', 
      description: 'Variable profit per order', 
      popular: true,
      owner: 'Finance Team',
      lastUpdated: '2024-02-15',
      definition: 'Variable Profit per Order represents the average profit contribution from each order after accounting for variable costs.',
      source: 'Calculated - contribution_margin / total_orders'
    },
    { 
      id: 'company-mau', 
      name: 'MAUs (L28D EOP)', 
      category: 'Operational', 
      description: 'Monthly active users', 
      popular: true,
      owner: 'Product Analytics',
      lastUpdated: '2024-02-15',
      definition: 'Monthly Active Users calculated as Last 28 Days End of Period - unique users who placed at least one order in the trailing 28-day window.',
      source: 'Data Warehouse - users.fact_active_users'
    },
    { 
      id: 'company-total-orders', 
      name: 'Total Orders', 
      category: 'Operational', 
      description: 'Total order count', 
      popular: false,
      owner: 'Product Analytics',
      lastUpdated: '2024-02-15',
      definition: 'Total number of orders placed on the platform, including all completed, cancelled, and refunded orders.',
      source: 'Data Warehouse - orders.fact_orders'
    },
    { 
      id: 'company-aov', 
      name: 'AOV (Average Order Value)', 
      category: 'Financial', 
      description: 'Average order value', 
      popular: false,
      owner: 'Finance Team',
      lastUpdated: '2024-02-15',
      definition: 'Average Order Value is calculated as Total GOV divided by Total Orders, representing the typical basket size.',
      source: 'Calculated - gov / total_orders'
    },
    { 
      id: 'company-ltv', 
      name: 'Customer LTV', 
      category: 'Financial', 
      description: 'Lifetime value of customers', 
      popular: false,
      owner: 'Finance Team',
      lastUpdated: '2024-02-15',
      definition: 'Customer Lifetime Value estimates the total net profit expected from a customer over their entire relationship with DoorDash.',
      source: 'Data Science Model - ltv_predictions.customer_ltv'
    },
  ],
  consumer: [
    { 
      id: 'consumer-orders', 
      name: 'Consumer Orders', 
      category: 'Operational', 
      description: 'Total consumer orders', 
      popular: true,
      owner: 'Consumer Team',
      lastUpdated: '2024-02-15',
      definition: 'Total number of orders placed by consumers on the DoorDash platform.',
      source: 'Data Warehouse - orders.fact_consumer_orders'
    },
    { 
      id: 'consumer-active', 
      name: 'Active Consumers', 
      category: 'Operational', 
      description: 'Active consumers in period', 
      popular: true,
      owner: 'Consumer Team',
      lastUpdated: '2024-02-15',
      definition: 'Number of unique consumers who placed at least one order during the measurement period.',
      source: 'Data Warehouse - users.fact_active_consumers'
    },
    { 
      id: 'consumer-retention', 
      name: 'Consumer Retention', 
      category: 'Operational', 
      description: 'Cohort retention rate', 
      popular: true,
      owner: 'Consumer Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of consumers who return to place another order within a defined time period after their first order.',
      source: 'Data Warehouse - users.fact_retention'
    },
    { 
      id: 'consumer-cac', 
      name: 'CAC (Customer Acquisition Cost)', 
      category: 'Financial', 
      description: 'Cost to acquire customer', 
      popular: false,
      owner: 'Marketing Team',
      lastUpdated: '2024-02-15',
      definition: 'Total marketing and acquisition costs divided by number of new customers acquired.',
      source: 'Data Warehouse - marketing.fact_cac'
    },
    { 
      id: 'consumer-frequency', 
      name: 'Order Frequency', 
      category: 'Operational', 
      description: 'Orders per active consumer', 
      popular: false,
      owner: 'Consumer Team',
      lastUpdated: '2024-02-15',
      definition: 'Average number of orders placed per active consumer during the measurement period.',
      source: 'Calculated - total_orders / active_consumers'
    },
  ],
  merchant: [
    { 
      id: 'merchant-selection', 
      name: 'Merchant Selection', 
      category: 'Operational', 
      description: 'Total active merchants', 
      popular: true,
      owner: 'Merchant Team',
      lastUpdated: '2024-02-15',
      definition: 'Number of unique active merchants available on the platform who received at least one order.',
      source: 'Data Warehouse - merchants.fact_active_merchants'
    },
    { 
      id: 'merchant-cancellation', 
      name: 'Merchant Cancellation Rate', 
      category: 'Quality', 
      description: 'Orders canceled by merchant', 
      popular: true,
      owner: 'Merchant Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of orders that are cancelled by the merchant after being placed.',
      source: 'Data Warehouse - orders.fact_merchant_cancellations'
    },
    { 
      id: 'merchant-satisfaction', 
      name: 'Merchant Satisfaction', 
      category: 'Quality', 
      description: 'Merchant NPS score', 
      popular: false,
      owner: 'Merchant Team',
      lastUpdated: '2024-02-15',
      definition: 'Net Promoter Score measuring merchant satisfaction and likelihood to recommend DoorDash to other merchants.',
      source: 'Survey Platform - merchant_surveys.nps'
    },
    { 
      id: 'merchant-sales', 
      name: 'Merchant Sales/Store', 
      category: 'Financial', 
      description: 'Average sales per merchant', 
      popular: false,
      owner: 'Merchant Team',
      lastUpdated: '2024-02-15',
      definition: 'Average revenue generated per merchant store on the DoorDash platform.',
      source: 'Calculated - total_merchant_revenue / active_merchants'
    },
  ],
  dasher: [
    { 
      id: 'dasher-active', 
      name: 'Active Dashers', 
      category: 'Operational', 
      description: 'Total active dashers', 
      popular: true,
      owner: 'Dasher Team',
      lastUpdated: '2024-02-15',
      definition: 'Number of unique dashers who completed at least one delivery during the measurement period.',
      source: 'Data Warehouse - dashers.fact_active_dashers'
    },
    { 
      id: 'dasher-acceptance', 
      name: 'Dasher Acceptance Rate', 
      category: 'Quality', 
      description: 'Offer acceptance rate', 
      popular: true,
      owner: 'Dasher Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of delivery offers that are accepted by dashers.',
      source: 'Data Warehouse - logistics.fact_dasher_acceptance'
    },
    { 
      id: 'dasher-cancellation', 
      name: 'Dasher Cancellation Rate', 
      category: 'Quality', 
      description: 'Orders canceled by dasher', 
      popular: true,
      owner: 'Dasher Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of accepted deliveries that are subsequently cancelled by the dasher.',
      source: 'Data Warehouse - logistics.fact_dasher_cancellations'
    },
    { 
      id: 'dasher-utilization', 
      name: 'Dasher Utilization', 
      category: 'Operational', 
      description: 'Active time percentage', 
      popular: false,
      owner: 'Dasher Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of time dashers spend actively completing deliveries versus being online and available.',
      source: 'Data Warehouse - logistics.fact_dasher_utilization'
    },
  ],
  logistics: [
    { 
      id: 'logistics-delivery-time', 
      name: 'Delivery Time', 
      category: 'Quality', 
      description: 'Average delivery time', 
      popular: true,
      owner: 'Logistics Team',
      lastUpdated: '2024-02-15',
      definition: 'Average time from order placement to delivery completion, measured in minutes.',
      source: 'Data Warehouse - logistics.fact_delivery_time'
    },
    { 
      id: 'logistics-eta-accuracy', 
      name: 'ETA Accuracy', 
      category: 'Quality', 
      description: 'Percentage within window', 
      popular: true,
      owner: 'Logistics Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of deliveries that arrive within the estimated time window communicated to the customer.',
      source: 'Data Warehouse - logistics.fact_eta_accuracy'
    },
    { 
      id: 'logistics-completion', 
      name: 'Completion Rate', 
      category: 'Quality', 
      description: 'Successfully completed deliveries', 
      popular: false,
      owner: 'Logistics Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of orders that are successfully completed without cancellation or major issues.',
      source: 'Data Warehouse - logistics.fact_completion_rate'
    },
  ],
  trust: [
    { 
      id: 'trust-consumer-satisfaction', 
      name: 'Consumer Satisfaction', 
      category: 'Quality', 
      description: 'Consumer CSAT score', 
      popular: true,
      owner: 'Trust & Safety Team',
      lastUpdated: '2024-02-15',
      definition: 'Customer Satisfaction score based on post-order surveys measuring overall experience.',
      source: 'Survey Platform - consumer_surveys.csat'
    },
    { 
      id: 'trust-defect-rate', 
      name: 'Order Defect Rate', 
      category: 'Quality', 
      description: 'Orders with issues', 
      popular: true,
      owner: 'Trust & Safety Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of orders that experience issues such as missing items, incorrect orders, or quality problems.',
      source: 'Data Warehouse - trust.fact_order_defects'
    },
  ],
  marketing: [
    { 
      id: 'marketing-cac', 
      name: 'Paid Marketing CAC', 
      category: 'Financial', 
      description: 'Customer acquisition cost', 
      popular: true,
      owner: 'Marketing Team',
      lastUpdated: '2024-02-15',
      definition: 'Cost to acquire a new customer through paid marketing channels.',
      source: 'Data Warehouse - marketing.fact_paid_cac'
    },
    { 
      id: 'marketing-roas', 
      name: 'Marketing ROAS', 
      category: 'Financial', 
      description: 'Return on ad spend', 
      popular: true,
      owner: 'Marketing Team',
      lastUpdated: '2024-02-15',
      definition: 'Return on Advertising Spend - revenue generated divided by marketing spend.',
      source: 'Data Warehouse - marketing.fact_roas'
    },
  ],
  product: [
    { 
      id: 'product-app-opens', 
      name: 'App Opens', 
      category: 'Operational', 
      description: 'Total app sessions', 
      popular: false,
      owner: 'Product Team',
      lastUpdated: '2024-02-15',
      definition: 'Total number of times users open the DoorDash mobile application.',
      source: 'Analytics - app_events.opens'
    },
    { 
      id: 'product-conversion', 
      name: 'Browse-to-Order Conversion', 
      category: 'Operational', 
      description: 'Conversion rate', 
      popular: true,
      owner: 'Product Team',
      lastUpdated: '2024-02-15',
      definition: 'Percentage of browsing sessions that result in a completed order.',
      source: 'Analytics - funnel.browse_to_order'
    },
  ]
};

const productAreaLabels: Record<string, string> = {
  company: 'Company / Top-line',
  consumer: 'Consumer',
  merchant: 'Merchant',
  dasher: 'Dasher',
  logistics: 'Logistics & Quality',
  trust: 'Trust & Safety',
  marketing: 'Marketing & Growth',
  product: 'Product Experience'
};

// Role-based default configurations
const getRoleDefaults = (role: string): ProductAreaConfig[] => {
  switch (role) {
    case 'business-executive':
      return [
        { id: 'company', name: 'Company / Top-line', enabled: true, selectedMetrics: ['company-gov', 'company-revenue', 'company-contribution', 'company-vp-order', 'company-mau'] },
        { id: 'consumer', name: 'Consumer', enabled: true, selectedMetrics: ['consumer-orders', 'consumer-active', 'consumer-retention'] },
        { id: 'merchant', name: 'Merchant', enabled: false, selectedMetrics: [] },
        { id: 'dasher', name: 'Dasher', enabled: false, selectedMetrics: [] },
        { id: 'logistics', name: 'Logistics & Quality', enabled: false, selectedMetrics: [] },
        { id: 'trust', name: 'Trust & Safety', enabled: false, selectedMetrics: [] },
        { id: 'marketing', name: 'Marketing & Growth', enabled: false, selectedMetrics: [] },
        { id: 'product', name: 'Product Experience', enabled: false, selectedMetrics: [] },
      ];
    case 'so-analyst':
      return [
        { id: 'company', name: 'Company / Top-line', enabled: true, selectedMetrics: ['company-gov', 'company-revenue', 'company-mau'] },
        { id: 'logistics', name: 'Logistics & Quality', enabled: true, selectedMetrics: ['logistics-delivery-time', 'logistics-eta-accuracy', 'logistics-completion'] },
        { id: 'dasher', name: 'Dasher', enabled: true, selectedMetrics: ['dasher-active', 'dasher-acceptance', 'dasher-cancellation'] },
        { id: 'merchant', name: 'Merchant', enabled: true, selectedMetrics: ['merchant-selection', 'merchant-cancellation'] },
        { id: 'consumer', name: 'Consumer', enabled: false, selectedMetrics: [] },
        { id: 'trust', name: 'Trust & Safety', enabled: false, selectedMetrics: [] },
        { id: 'marketing', name: 'Marketing & Growth', enabled: false, selectedMetrics: [] },
        { id: 'product', name: 'Product Experience', enabled: false, selectedMetrics: [] },
      ];
    default:
      return [
        { id: 'company', name: 'Company / Top-line', enabled: true, selectedMetrics: ['company-gov', 'company-revenue', 'company-mau'] },
        { id: 'consumer', name: 'Consumer', enabled: false, selectedMetrics: [] },
        { id: 'merchant', name: 'Merchant', enabled: false, selectedMetrics: [] },
        { id: 'dasher', name: 'Dasher', enabled: false, selectedMetrics: [] },
        { id: 'logistics', name: 'Logistics & Quality', enabled: false, selectedMetrics: [] },
        { id: 'trust', name: 'Trust & Safety', enabled: false, selectedMetrics: [] },
        { id: 'marketing', name: 'Marketing & Growth', enabled: false, selectedMetrics: [] },
        { id: 'product', name: 'Product Experience', enabled: false, selectedMetrics: [] },
      ];
  }
};

export function ScorecardCustomization({ 
  isOpen, 
  onClose, 
  userRole,
  currentConfig,
  onSave,
  onChange
}: ScorecardCustomizationProps) {
  const [config, setConfig] = useState<ProductAreaConfig[]>(currentConfig);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [totalMetrics, setTotalMetrics] = useState(0);
  const [selectedMetricInfo, setSelectedMetricInfo] = useState<(MetricOption & { areaId: string }) | null>(null);

  useEffect(() => {
    setConfig(currentConfig);
    calculateTotalMetrics(currentConfig);
  }, [currentConfig]);

  const calculateTotalMetrics = (cfg: ProductAreaConfig[]) => {
    const total = cfg.reduce((sum, area) => sum + area.selectedMetrics.length, 0);
    setTotalMetrics(total);
  };

  const handleToggleArea = (areaId: string) => {
    const updated = config.map(area => 
      area.id === areaId ? { ...area, enabled: !area.enabled } : area
    );
    setConfig(updated);
    calculateTotalMetrics(updated);
    if (onChange) onChange(updated);
  };

  const handleToggleMetric = (areaId: string, metricId: string) => {
    const updated = config.map(area => {
      if (area.id === areaId) {
        const isSelected = area.selectedMetrics.includes(metricId);
        const selectedMetrics = isSelected
          ? area.selectedMetrics.filter(id => id !== metricId)
          : [...area.selectedMetrics, metricId];
        return { ...area, selectedMetrics };
      }
      return area;
    });
    setConfig(updated);
    calculateTotalMetrics(updated);
    if (onChange) onChange(updated);
  };

  const handleReset = () => {
    const defaults = getRoleDefaults(userRole);
    setConfig(defaults);
    calculateTotalMetrics(defaults);
    toast.success('Reset to default configuration');
  };

  const handleSave = () => {
    onSave(config);
    toast.success('Scorecard customization saved');
    onClose();
  };

  const handleAddPopularMetric = (areaId: string, metricId: string) => {
    // First enable the area if not already
    let updated = config.map(area => {
      if (area.id === areaId && !area.enabled) {
        return { ...area, enabled: true };
      }
      return area;
    });
    
    // Then add the metric
    updated = updated.map(area => {
      if (area.id === areaId && !area.selectedMetrics.includes(metricId)) {
        return { ...area, selectedMetrics: [...area.selectedMetrics, metricId] };
      }
      return area;
    });
    
    setConfig(updated);
    calculateTotalMetrics(updated);
    if (onChange) onChange(updated);
  };

  const getPopularMetricsForQuickAdd = () => {
    const allPopular: (MetricOption & { areaId: string })[] = [];
    Object.entries(availableMetricsByArea).forEach(([areaId, metrics]) => {
      metrics.filter(m => m.popular).forEach(metric => {
        const area = config.find(a => a.id === areaId);
        if (area && !area.selectedMetrics.includes(metric.id)) {
          allPopular.push({ ...metric, areaId });
        }
      });
    });
    return allPopular.slice(0, 3);
  };

  // Get all currently selected metrics across all areas
  const getAllSelectedMetrics = () => {
    const selected: (MetricOption & { areaId: string; areaName: string })[] = [];
    config.forEach(area => {
      if (area.enabled && area.selectedMetrics.length > 0) {
        const metrics = availableMetricsByArea[area.id] || [];
        area.selectedMetrics.forEach(metricId => {
          const metric = metrics.find(m => m.id === metricId);
          if (metric) {
            selected.push({ ...metric, areaId: area.id, areaName: area.name });
          }
        });
      }
    });
    return selected;
  };

  // Handle removing a metric from current list
  const handleRemoveMetric = (areaId: string, metricId: string) => {
    handleToggleMetric(areaId, metricId);
    toast.success('Metric removed from scorecard');
  };

  // Search and filter metrics
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const results: (MetricOption & { areaId: string; areaName: string })[] = [];
    Object.entries(availableMetricsByArea).forEach(([areaId, metrics]) => {
      metrics.forEach(metric => {
        if (
          metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          metric.category.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ ...metric, areaId, areaName: productAreaLabels[areaId] });
        }
      });
    });
    return results;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Side Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="ml-auto relative w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold">Customize Your Scorecard</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium">
                  {totalMetrics} {totalMetrics === 1 ? 'metric' : 'metrics'}
                </Badge>
                {totalMetrics <= 10 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Optimal
                  </span>
                ) : totalMetrics <= 20 ? (
                  <span className="text-yellow-600 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Balanced
                  </span>
                ) : (
                  <span className="text-orange-600 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Dense
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.trim() && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Search Results ({getSearchResults().length})
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getSearchResults().length > 0 ? (
                    getSearchResults().map((metric) => {
                      const area = config.find(a => a.id === metric.areaId);
                      const isSelected = area?.selectedMetrics.includes(metric.id) ?? false;

                      return (
                        <button
                          key={metric.id}
                          onClick={() => handleToggleMetric(metric.areaId, metric.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all text-left"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{metric.areaName} • {metric.category}</p>
                          </div>
                          <Badge className={isSelected ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs" : "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs"}>
                            {isSelected ? '✓ Added' : '+ Add'}
                          </Badge>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No metrics found</p>
                  )}
                </div>
              </div>
            )}

            {/* Current Metrics - Only show when not searching */}
            {!searchQuery.trim() && totalMetrics > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Current Metrics ({totalMetrics})
                </p>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {getAllSelectedMetrics().map((metric) => (
                    <div
                      key={`${metric.areaId}-${metric.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{metric.areaName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMetricInfo({ ...metric, areaId: metric.areaId });
                          }}
                          className="shrink-0 h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMetric(metric.areaId, metric.id)}
                          className="shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tip Banner - Only show when not searching */}
            {!searchQuery.trim() && (
              <div className="mb-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-900 dark:text-blue-100 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Show only what you check weekly. You can always add more metrics later.</span>
                </p>
              </div>
            )}

            {/* Quick Add - Popular Metrics - Only show when not searching */}
            {!searchQuery.trim() && getPopularMetricsForQuickAdd().length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Add:</p>
                <div className="space-y-2">
                  {getPopularMetricsForQuickAdd().map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => handleAddPopularMetric(metric.areaId, metric.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{productAreaLabels[metric.areaId]}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs">
                        + Add
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Areas - Only show when not searching */}
            {!searchQuery.trim() && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Areas:</p>
                
                {config.map((area) => {
                  const availableMetrics = availableMetricsByArea[area.id] || [];
                  const isExpanded = expandedArea === area.id;
                  
                  return (
                    <div key={area.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {/* Area Header */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => handleToggleArea(area.id)}
                            className="shrink-0"
                          >
                            {area.enabled ? (
                              <CheckCircle2 className="h-5 w-5 text-purple-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{area.name}</p>
                            {area.enabled && area.selectedMetrics.length > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {area.selectedMetrics.length} {area.selectedMetrics.length === 1 ? 'metric' : 'metrics'} selected
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {area.enabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedArea(isExpanded ? null : area.id)}
                            className="shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Metrics List */}
                      {area.enabled && isExpanded && (
                        <div className="p-3 space-y-2 bg-white dark:bg-gray-900">
                          {availableMetrics.map((metric) => {
                            const isSelected = area.selectedMetrics.includes(metric.id);
                            
                            return (
                              <button
                                key={metric.id}
                                onClick={() => handleToggleMetric(area.id, metric.id)}
                                className="w-full flex items-start gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                              >
                                <div className="shrink-0 mt-0.5">
                                  {isSelected ? (
                                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metric.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                                </div>
                                {metric.popular && (
                                  <Badge variant="outline" className="text-[10px] shrink-0">
                                    Popular
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Information Density Guidance */}
            {totalMetrics > 20 && (
              <div className="mt-6 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-orange-900 dark:text-orange-100 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>You're showing {totalMetrics} metrics. Consider creating multiple views for different review types to avoid information overload.</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metric Details Modal */}
        {selectedMetricInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedMetricInfo(null)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div 
              className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {selectedMetricInfo.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {productAreaLabels[selectedMetricInfo.areaId]}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMetricInfo(null)}
                    className="shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-5">
                  {/* Metric Category Badge */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {selectedMetricInfo.category}
                    </Badge>
                    {selectedMetricInfo.popular && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Popular Metric
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMetricInfo.description}
                    </p>
                  </div>

                  {/* Definition */}
                  {selectedMetricInfo.definition && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Definition</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {selectedMetricInfo.definition}
                      </p>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {/* Owner */}
                    {selectedMetricInfo.owner && (
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Owner</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {selectedMetricInfo.owner}
                        </p>
                      </div>
                    )}

                    {/* Last Updated */}
                    {selectedMetricInfo.lastUpdated && (
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {new Date(selectedMetricInfo.lastUpdated).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Data Source */}
                  {selectedMetricInfo.source && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Source</h4>
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                          {selectedMetricInfo.source}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMetricInfo(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}