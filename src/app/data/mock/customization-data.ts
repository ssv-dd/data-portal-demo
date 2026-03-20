import type { MetricOption } from '@/types';

// All available metrics organized by product area
export const availableMetricsByArea: Record<string, MetricOption[]> = {
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
