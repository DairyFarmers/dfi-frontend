import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function FinancialSummaryCard({ financialData }) {
  const {
    profit_loss = {},
    expenses = {},
    outstanding_payments = 0,
    profit_loss_chart = [],
    expense_chart = []
  } = financialData || {};

  // Calculate net profit
  const netProfit = (profit_loss.profit || 0) - (profit_loss.loss || 0);

  // Transform expenses for chart
  const expenseData = Object.entries(expenses).map(([category, amount]) => ({
    category: category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    amount: amount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Profit</p>
              <p className="text-2xl font-bold text-green-600">
                ${profit_loss.profit?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loss</p>
              <p className="text-2xl font-bold text-red-600">
                ${profit_loss.loss?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netProfit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${outstanding_payments.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Profit/Loss Trend */}
          <div>
            <h4 className="text-sm font-medium mb-2">Profit/Loss Trend</h4>
            <AreaChart
              width={400}
              height={200}
              data={profit_loss_chart}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.3} 
              />
              <Area 
                type="monotone" 
                dataKey="loss" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </div>

          {/* Expenses Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-2">Expense Breakdown</h4>
            <BarChart
              width={400}
              height={200}
              data={expenseData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}