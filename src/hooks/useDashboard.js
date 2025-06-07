import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useSelector } from 'react-redux';

export function useDashboard(timeRange = 'week') {
  const { user } = useSelector((state) => state.user);

  return useQuery({
    queryKey: ['dashboard', 'summary', timeRange],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/dashboard/summary', {
          params: { time_range: timeRange },
          withCredentials: true
        });
    
        if (!response?.status){
          throw new Error('Invalid response from server');
        }

        if (user?.role?.name === 'farmer') {
          const data = response?.data;
          console.log("Dashboard data:", data);
          return {
            production_metrics: {
              dairy: {
                ...data?.production_metrics?.dairy,
                chart_data: transformDairyData(data?.production_metrics?.dairy)
              }
            },
            inventory_metrics: {
              ...data?.inventory_metrics,
              storage_chart: transformStorageData(data?.inventory_metrics)
            },
            market_metrics: {
              ...data?.market_metrics,
              price_trends: transformMarketData(data?.market_metrics?.market_prices),
              sales_performance: transformSalesData(data?.market_metrics?.best_selling_products)
            },
            financial_metrics: {
              ...data?.financial_metrics,
              profit_loss_chart: transformFinancialData(data?.financial_metrics?.profit_loss),
              expense_chart: transformExpenseData(data?.financial_metrics?.expenses)
            },
            operational_metrics: {
              ...data?.operational_metrics,
              equipment_status: transformEquipmentData(data?.operational_metrics?.equipment_status)
            },
            sales_metrics: {
              ...data?.sales_metrics,
              revenue_chart: transformRevenueData(data?.sales_metrics?.revenue_trends),
              buyer_chart: transformBuyerData(data?.sales_metrics?.buyer_insights)
            }
          };
        }

        return response?.data || {};
      } catch (error) {
        throw new Error('Failed to fetch dashboard data');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000
  });
}

function transformDairyData(dairyMetrics) {
  if (!dairyMetrics?.daily_production) return [];
  
  return Object.entries(dairyMetrics.daily_production).map(([product, quantity]) => {
    const quality = getQualityForProduct(product, dairyMetrics.quality_metrics);
    return {
      product,
      quantity,
      qualityScore: `${quality.gradeA}%`, // Use the Grade A percentage as main quality score
      qualityBreakdown: [
        { grade: 'A', value: quality.gradeA },
        { grade: 'B', value: quality.gradeB },
        { grade: 'C', value: quality.gradeC }
      ],
      inventory: dairyMetrics.inventory_status?.in_stock || 0
    };
  });
}

function transformStorageData(inventoryData) {
  if (!inventoryData?.storage_utilization) return [];
  return [{
    value: parseInt(inventoryData.storage_utilization),
    total: inventoryData.current_stock,
    expiring: inventoryData.expiring_soon,
    label: 'Storage Used',
    color: getUtilizationColor(parseInt(inventoryData.storage_utilization))
  }];
}

function transformMarketData(marketPrices) {
  if (!marketPrices) return [];
  return Object.entries(marketPrices).map(([product, price]) => ({
    product,
    price: parseFloat(price),
    label: `${product} - $${price}`
  }));
}

function transformSalesData(bestSelling) {
  if (!Array.isArray(bestSelling)) return [];
  return bestSelling.map((product, index) => ({
    name: product,
    rank: index + 1,
    trend: 'up' // You might want to calculate this based on historical data
  }));
}

function transformFinancialData(profitLoss) {
  if (!profitLoss) return [];
  return [{
    profit: profitLoss.profit || 0,
    loss: profitLoss.loss || 0,
    net: (profitLoss.profit || 0) - (profitLoss.loss || 0)
  }];
}

function transformExpenseData(expenses) {
  if (!expenses) return [];
  const total = getTotalExpenses(expenses);
  return Object.entries(expenses).map(([category, amount]) => ({
    category: formatExpenseCategory(category),
    amount: parseFloat(amount),
    percentage: (amount / total) * 100
  }));
}

function transformEquipmentData(equipment) {
  if (!equipment) return [];
  return {
    operational: equipment.operational || 0,
    maintenance: equipment.maintenance_needed || 0,
    total: (equipment.operational || 0) + (equipment.maintenance_needed || 0)
  };
}

function transformRevenueData(revenueTrends) {
  if (!revenueTrends) return [];
  return {
    monthly: parseFloat(revenueTrends.monthly_growth),
    yearly: parseFloat(revenueTrends.yearly_growth),
    trend: revenueTrends.monthly_growth > 0 ? 'up' : 'down'
  };
}

function transformBuyerData(buyerInsights) {
  if (!buyerInsights) return [];
  return {
    repeat: buyerInsights.repeat_buyers || 0,
    new: buyerInsights.new_buyers || 0,
    total: (buyerInsights.repeat_buyers || 0) + (buyerInsights.new_buyers || 0)
  };
}

// Helper functions
function getQualityForProduct(product, qualityMetrics) {
  if (!qualityMetrics) return {};
  return {
    gradeA: parseFloat(qualityMetrics.grade_a) || 0,
    gradeB: parseFloat(qualityMetrics.grade_b) || 0,
    gradeC: parseFloat(qualityMetrics.grade_c) || 0
  };
}

function getUtilizationColor(percentage) {
  if (percentage >= 90) return 'destructive';
  if (percentage >= 75) return 'warning';
  return 'success';
}

function getTotalExpenses(expenses) {
  return Object.values(expenses).reduce((sum, amount) => sum + parseFloat(amount), 0);
}

function formatExpenseCategory(category) {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}