import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function InventoryStatusCard({ inventory }) {
  const {
    current_stock = 0,
    storage_utilization = '0%',
    expiring_soon = 0,
    storage_chart = []
  } = inventory || {};

  const utilizationPercentage = parseInt(storage_utilization) || 0;

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Storage Utilization</span>
            <span className={`font-medium ${getUtilizationColor(utilizationPercentage)}`}>
              {storage_utilization}
            </span>
          </div>
          <Progress 
            value={utilizationPercentage} 
            className={`h-2 ${
              utilizationPercentage >= 90 
                ? 'bg-red-100' 
                : utilizationPercentage >= 75 
                  ? 'bg-yellow-100' 
                  : 'bg-green-100'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="text-2xl font-bold">{current_stock}L</p>
            <p className="text-sm text-muted-foreground">Total Capacity</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
            <p className={`text-2xl font-bold ${
              expiring_soon > 100 ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {expiring_soon}L
            </p>
            <p className="text-sm text-muted-foreground">needs attention</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}