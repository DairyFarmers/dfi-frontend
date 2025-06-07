import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function DairyProductionChart({ data, timeRange }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split(' ')[0]}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="quantity" 
            stroke="#8884d8" 
            name="Production (L)"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="quality" 
            stroke="#82ca9d" 
            name="Quality Score"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}