import { useState, useEffect } from 'react';
import styled from 'styled-components';
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
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/app/lib/toast';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';

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
  selectedMetrics: string[];
}

interface ScorecardCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  currentConfig: ProductAreaConfig[];
  onSave: (config: ProductAreaConfig[]) => void;
  onChange?: (config: ProductAreaConfig[]) => void;
}

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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
`;

const Backdrop = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgb(var(--app-overlay-rgb) / 0.3);
  backdrop-filter: blur(4px);
`;

const SidePanel = styled(motion.div)`
  margin-left: auto;
  position: relative;
  width: 100%;
  max-width: 576px;
  background-color: ${colors.white};
  box-shadow: ${shadows['2xl']};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-bottom: 1px solid ${colors.border};
  background: linear-gradient(to right, ${colors.purple50}, var(--app-status-info-bg));
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const PanelTitle = styled.h2`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const StatusText = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
`;

const SearchSection = styled.div`
  margin-bottom: ${Theme.usage.space.large};
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchIconStyled = styled(Search)`
  position: absolute;
  left: ${Theme.usage.space.small};
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 16px;
  color: ${colors.mutedForeground};
  opacity: 0.6;
`;

const ResultsSection = styled.div`
  margin-bottom: ${Theme.usage.space.large};
`;

const SectionLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.small};
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  max-height: 384px;
  overflow-y: auto;
`;

const SearchResultButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  background-color: ${colors.white};
  cursor: pointer;
  text-align: left;
  transition: all 200ms;

  &:hover {
    border-color: ${colors.purple400};
    box-shadow: ${shadows.cardHover};
  }
`;

const ResultTextContent = styled.div`
  flex: 1;
`;

const ResultName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const ResultMeta = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const EmptyResults = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  text-align: center;
  padding: ${Theme.usage.space.medium} 0;
`;

const CurrentMetricCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  background-color: ${colors.white};
  transition: all 200ms;

  &:hover {
    border-color: ${colors.borderStrong};
  }
`;

const MetricCardText = styled.div`
  flex: 1;
`;

const MetricCardName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const MetricCardArea = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const MetricCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const IconButton = styled(Button)`
  flex-shrink: 0;
  height: 32px;
  width: 32px;
  padding: 0;
`;

const TipBanner = styled.div`
  margin-bottom: ${Theme.usage.space.large};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background-color: var(--app-status-info-bg);
  border: 1px solid #bfdbfe;
`;

const TipText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: #1e3a5f;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const QuickAddSection = styled.div`
  margin-bottom: ${Theme.usage.space.large};
`;

const QuickAddButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  background-color: ${colors.white};
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    border-color: ${colors.purple400};
    box-shadow: ${shadows.cardHover};
  }
`;

const QuickAddText = styled.div`
  flex: 1;
  text-align: left;
`;

const QuickAddName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const QuickAddArea = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const ProductAreasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
`;

const AreaCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radius.xl};
  overflow: hidden;
`;

const AreaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.small};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
`;

const AreaHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.small};
  flex: 1;
`;

const AreaToggleButton = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const AreaInfo = styled.div`
  flex: 1;
`;

const AreaName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const AreaMetricCount = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const MetricsList = styled.div`
  padding: ${Theme.usage.space.small};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  background-color: ${colors.white};
`;

const MetricToggleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 150ms;

  &:hover {
    background-color: rgb(var(--app-accent-rgb) / 0.4);
  }
`;

const MetricToggleIcon = styled.div`
  flex-shrink: 0;
  margin-top: ${Theme.usage.space.xxxSmall};
`;

const MetricToggleText = styled.div`
  flex: 1;
`;

const MetricToggleName = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const MetricToggleDesc = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const DensityWarning = styled.div`
  margin-top: ${Theme.usage.space.large};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background-color: var(--app-status-warning-bg-light);
  border: 1px solid #fed7aa;
`;

const DensityText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: #9a3412;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const PanelFooter = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-top: 1px solid ${colors.border};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${Theme.usage.space.small};
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const MetricInfoOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${Theme.usage.space.medium};
`;

const MetricInfoBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgb(var(--app-overlay-rgb) / 0.5);
`;

const MetricInfoModal = styled.div`
  position: relative;
  background-color: ${colors.white};
  border-radius: ${radius.xl};
  box-shadow: ${shadows['2xl']};
  max-width: 672px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MetricInfoHeader = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-bottom: 1px solid ${colors.border};
  background: linear-gradient(to right, var(--app-status-info-bg), #eef2ff);
`;

const MetricInfoHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const MetricInfoTitle = styled.h3`
  font-weight: 600;
  font-size: ${Theme.usage.fontSize.medium};
  color: ${colors.foreground};
`;

const MetricInfoSubtitle = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-top: ${Theme.usage.space.xxSmall};
`;

const MetricInfoContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
`;

const MetricInfoSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const InfoSectionTitle = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const InfoSectionText = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  line-height: 1.625;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${Theme.usage.space.medium};
  padding-top: ${Theme.usage.space.xSmall};
`;

const MetadataCard = styled.div`
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
`;

const MetadataLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const MetadataValue = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const SourceCodeBox = styled.div`
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.lg};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
`;

const SourceCode = styled.code`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
`;

const MetricInfoFooter = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-top: 1px solid ${colors.border};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  display: flex;
  justify-content: flex-end;
`;

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
    let updated = config.map(area => {
      if (area.id === areaId && !area.enabled) {
        return { ...area, enabled: true };
      }
      return area;
    });
    
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

  const handleRemoveMetric = (areaId: string, metricId: string) => {
    handleToggleMetric(areaId, metricId);
    toast.success('Metric removed from scorecard');
  };

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
      <Overlay>
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <SidePanel
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <PanelHeader>
            <HeaderTopRow>
              <HeaderTitleGroup>
                <Settings style={{ height: '20px', width: '20px', color: colors.purple600 }} />
                <PanelTitle>Customize Your Scorecard</PanelTitle>
              </HeaderTitleGroup>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                style={{ flexShrink: 0 }}
              >
                <X style={{ height: '20px', width: '20px' }} />
              </Button>
            </HeaderTopRow>
            
            <StatsRow>
              <StatusGroup>
                <Badge variant="outline" style={{ fontSize: '12px', fontWeight: 500 }}>
                  {totalMetrics} {totalMetrics === 1 ? 'metric' : 'metrics'}
                </Badge>
                {totalMetrics <= 10 ? (
                  <StatusText $color={colors.green600}>
                    <CheckCircle2 style={{ height: '12px', width: '12px' }} />
                    Optimal
                  </StatusText>
                ) : totalMetrics <= 20 ? (
                  <StatusText $color={colors.yellow600}>
                    <Info style={{ height: '12px', width: '12px' }} />
                    Balanced
                  </StatusText>
                ) : (
                  <StatusText $color="#ea580c">
                    <Info style={{ height: '12px', width: '12px' }} />
                    Dense
                  </StatusText>
                )}
              </StatusGroup>
            </StatsRow>
          </PanelHeader>

          <ContentArea>
            <SearchSection>
              <SearchInputWrapper>
                <SearchIconStyled />
                <Input
                  type="text"
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </SearchInputWrapper>
            </SearchSection>

            {searchQuery.trim() && (
              <ResultsSection>
                <SectionLabel>
                  Search Results ({getSearchResults().length})
                </SectionLabel>
                <ResultsList>
                  {getSearchResults().length > 0 ? (
                    getSearchResults().map((metric) => {
                      const area = config.find(a => a.id === metric.areaId);
                      const isSelected = area?.selectedMetrics.includes(metric.id) ?? false;

                      return (
                        <SearchResultButton
                          key={metric.id}
                          onClick={() => handleToggleMetric(metric.areaId, metric.id)}
                        >
                          <ResultTextContent>
                            <ResultName>{metric.name}</ResultName>
                            <ResultMeta>{metric.areaName} &bull; {metric.category}</ResultMeta>
                          </ResultTextContent>
                          <Badge style={{
                            background: isSelected
                              ? 'linear-gradient(to right, #22c55e, #10b981)'
                              : 'linear-gradient(to right, #a855f7, #3b82f6)',
                            color: colors.white,
                            border: 0,
                            fontSize: '12px',
                          }}>
                            {isSelected ? '✓ Added' : '+ Add'}
                          </Badge>
                        </SearchResultButton>
                      );
                    })
                  ) : (
                    <EmptyResults>No metrics found</EmptyResults>
                  )}
                </ResultsList>
              </ResultsSection>
            )}

            {!searchQuery.trim() && totalMetrics > 0 && (
              <ResultsSection>
                <SectionLabel>
                  Current Metrics ({totalMetrics})
                </SectionLabel>
                <ResultsList style={{ maxHeight: '320px' }}>
                  {getAllSelectedMetrics().map((metric) => (
                    <CurrentMetricCard key={`${metric.areaId}-${metric.id}`}>
                      <MetricCardText>
                        <MetricCardName>{metric.name}</MetricCardName>
                        <MetricCardArea>{metric.areaName}</MetricCardArea>
                      </MetricCardText>
                      <MetricCardActions>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMetricInfo({ ...metric, areaId: metric.areaId });
                          }}
                        >
                          <Info style={{ height: '16px', width: '16px' }} />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMetric(metric.areaId, metric.id)}
                        >
                          <Trash2 style={{ height: '16px', width: '16px' }} />
                        </IconButton>
                      </MetricCardActions>
                    </CurrentMetricCard>
                  ))}
                </ResultsList>
              </ResultsSection>
            )}

            {!searchQuery.trim() && (
              <TipBanner>
                <TipText>
                  <Info style={{ height: '16px', width: '16px', flexShrink: 0, marginTop: '2px' }} />
                  <span>Show only what you check weekly. You can always add more metrics later.</span>
                </TipText>
              </TipBanner>
            )}

            {!searchQuery.trim() && getPopularMetricsForQuickAdd().length > 0 && (
              <QuickAddSection>
                <SectionLabel>Quick Add:</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {getPopularMetricsForQuickAdd().map((metric) => (
                    <QuickAddButton
                      key={metric.id}
                      onClick={() => handleAddPopularMetric(metric.areaId, metric.id)}
                    >
                      <QuickAddText>
                        <QuickAddName>{metric.name}</QuickAddName>
                        <QuickAddArea>{productAreaLabels[metric.areaId]}</QuickAddArea>
                      </QuickAddText>
                      <Badge style={{
                        background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                        color: colors.white,
                        border: 0,
                        fontSize: '12px',
                      }}>
                        + Add
                      </Badge>
                    </QuickAddButton>
                  ))}
                </div>
              </QuickAddSection>
            )}

            {!searchQuery.trim() && (
              <ProductAreasContainer>
                <SectionLabel>Product Areas:</SectionLabel>
                
                {config.map((area) => {
                  const availableMetrics = availableMetricsByArea[area.id] || [];
                  const isExpanded = expandedArea === area.id;
                  
                  return (
                    <AreaCard key={area.id}>
                      <AreaHeader>
                        <AreaHeaderLeft>
                          <AreaToggleButton onClick={() => handleToggleArea(area.id)}>
                            {area.enabled ? (
                              <CheckCircle2 style={{ height: '20px', width: '20px', color: colors.purple600 }} />
                            ) : (
                              <Circle style={{ height: '20px', width: '20px', color: colors.mutedForeground, opacity: 0.6 }} />
                            )}
                          </AreaToggleButton>
                          <AreaInfo>
                            <AreaName>{area.name}</AreaName>
                            {area.enabled && area.selectedMetrics.length > 0 && (
                              <AreaMetricCount>
                                {area.selectedMetrics.length} {area.selectedMetrics.length === 1 ? 'metric' : 'metrics'} selected
                              </AreaMetricCount>
                            )}
                          </AreaInfo>
                        </AreaHeaderLeft>
                        
                        {area.enabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedArea(isExpanded ? null : area.id)}
                            style={{ flexShrink: 0 }}
                          >
                            {isExpanded ? (
                              <ChevronDown style={{ height: '16px', width: '16px' }} />
                            ) : (
                              <ChevronRight style={{ height: '16px', width: '16px' }} />
                            )}
                          </Button>
                        )}
                      </AreaHeader>

                      {area.enabled && isExpanded && (
                        <MetricsList>
                          {availableMetrics.map((metric) => {
                            const isSelected = area.selectedMetrics.includes(metric.id);
                            
                            return (
                              <MetricToggleButton
                                key={metric.id}
                                onClick={() => handleToggleMetric(area.id, metric.id)}
                              >
                                <MetricToggleIcon>
                                  {isSelected ? (
                                    <CheckCircle2 style={{ height: '16px', width: '16px', color: colors.purple600 }} />
                                  ) : (
                                    <Circle style={{ height: '16px', width: '16px', color: colors.mutedForeground, opacity: 0.6 }} />
                                  )}
                                </MetricToggleIcon>
                                <MetricToggleText>
                                  <MetricToggleName>{metric.name}</MetricToggleName>
                                  <MetricToggleDesc>{metric.description}</MetricToggleDesc>
                                </MetricToggleText>
                                {metric.popular && (
                                  <Badge variant="outline" style={{ fontSize: '12px', flexShrink: 0 }}>
                                    Popular
                                  </Badge>
                                )}
                              </MetricToggleButton>
                            );
                          })}
                        </MetricsList>
                      )}
                    </AreaCard>
                  );
                })}
              </ProductAreasContainer>
            )}

            {totalMetrics > 20 && (
              <DensityWarning>
                <DensityText>
                  <Info style={{ height: '16px', width: '16px', flexShrink: 0, marginTop: '2px' }} />
                  <span>You're showing {totalMetrics} metrics. Consider creating multiple views for different review types to avoid information overload.</span>
                </DensityText>
              </DensityWarning>
            )}
          </ContentArea>

          <PanelFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw style={{ height: '16px', width: '16px' }} />
              Reset to Default
            </Button>
            
            <FooterRight>
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
                style={{
                  background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                  color: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Save style={{ height: '16px', width: '16px' }} />
                Save Changes
              </Button>
            </FooterRight>
          </PanelFooter>
        </SidePanel>

        {selectedMetricInfo && (
          <MetricInfoOverlay
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setSelectedMetricInfo(null)}
          >
            <MetricInfoBackdrop />
            <MetricInfoModal onClick={(e) => e.stopPropagation()}>
              <MetricInfoHeader>
                <MetricInfoHeaderRow>
                  <div style={{ flex: 1 }}>
                    <MetricInfoTitle>
                      {selectedMetricInfo.name}
                    </MetricInfoTitle>
                    <MetricInfoSubtitle>
                      {productAreaLabels[selectedMetricInfo.areaId]}
                    </MetricInfoSubtitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMetricInfo(null)}
                    style={{ flexShrink: 0 }}
                  >
                    <X style={{ height: '20px', width: '20px' }} />
                  </Button>
                </MetricInfoHeaderRow>
              </MetricInfoHeader>

              <MetricInfoContent>
                <MetricInfoSections>
                  <BadgeGroup>
                    <Badge style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                      {selectedMetricInfo.category}
                    </Badge>
                    {selectedMetricInfo.popular && (
                      <Badge style={{ backgroundColor: 'var(--app-status-success-bg)', color: '#15803d' }}>
                        Popular Metric
                      </Badge>
                    )}
                  </BadgeGroup>

                  <div>
                    <InfoSectionTitle>Description</InfoSectionTitle>
                    <InfoSectionText>
                      {selectedMetricInfo.description}
                    </InfoSectionText>
                  </div>

                  {selectedMetricInfo.definition && (
                    <div>
                      <InfoSectionTitle>Definition</InfoSectionTitle>
                      <InfoSectionText>
                        {selectedMetricInfo.definition}
                      </InfoSectionText>
                    </div>
                  )}

                  <MetadataGrid>
                    {selectedMetricInfo.owner && (
                      <MetadataCard>
                        <MetadataLabel>Owner</MetadataLabel>
                        <MetadataValue>
                          {selectedMetricInfo.owner}
                        </MetadataValue>
                      </MetadataCard>
                    )}

                    {selectedMetricInfo.lastUpdated && (
                      <MetadataCard>
                        <MetadataLabel>Last Updated</MetadataLabel>
                        <MetadataValue>
                          {new Date(selectedMetricInfo.lastUpdated).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </MetadataValue>
                      </MetadataCard>
                    )}
                  </MetadataGrid>

                  {selectedMetricInfo.source && (
                    <div>
                      <InfoSectionTitle>Data Source</InfoSectionTitle>
                      <SourceCodeBox>
                        <SourceCode>
                          {selectedMetricInfo.source}
                        </SourceCode>
                      </SourceCodeBox>
                    </div>
                  )}
                </MetricInfoSections>
              </MetricInfoContent>

              <MetricInfoFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMetricInfo(null)}
                >
                  Close
                </Button>
              </MetricInfoFooter>
            </MetricInfoModal>
          </MetricInfoOverlay>
        )}
      </Overlay>
    </AnimatePresence>
  );
}
