import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MarketInsightsCard({ marketData }) {
  const {
    market_prices = {},
    demand_forecast = 'neutral',
    best_selling_products = [],
    competitor_analysis = {},
    price_trends = [],
    sales_performance = []
  } = marketData || {};

  // Transform market prices for chart
  const priceChartData = Object.entries(market_prices).map(([product, price]) => ({
    product: product.charAt(0).toUpperCase() + product.slice(1),
    price
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price Trends */}
          <div>
            <h4 className="text-sm font-medium mb-2">Current Market Prices</h4>
            <BarChart
              width={400}
              height={200}
              data={priceChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Market Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Market Status</h4>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Demand Forecast</p>
                <p className="text-lg font-semibold capitalize">{demand_forecast}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Market Share</h4>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Current Position</p>
                <p className="text-lg font-semibold">{competitor_analysis.market_share}</p>
              </div>
            </div>
          </div>

          {/* Best Selling Products */}
          <div>
            <h4 className="text-sm font-medium mb-2">Top Products</h4>
            <div className="space-y-2">
              {best_selling_products.map((product, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-muted/50 p-2 rounded"
                >
                  <span className="text-sm font-medium">
                    {index + 1}. {product}
                  </span>
                  {index === 0 && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      Best Seller
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Analysis */}
          <div>
            <h4 className="text-sm font-medium mb-2">Market Position</h4>
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm">Price Comparison:</span>
                <span className="text-sm font-medium capitalize">
                  {competitor_analysis.price_comparison}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}