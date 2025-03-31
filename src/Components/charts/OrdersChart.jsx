import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./Chart.scss";

const OrdersChart = ({ data }) => {
  const COLORS = ["#FFA500", "#28a745", "#dc3545"];

  const orderData = [
    { name: "Pending", value: 5 },
    { name: "Completed", value: 10 },
    { name: "Cancelled", value: 2 },
  ];
  
  return (
    <div className="chart">
      <h5 className="text-center">Orders Overview</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {orderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;