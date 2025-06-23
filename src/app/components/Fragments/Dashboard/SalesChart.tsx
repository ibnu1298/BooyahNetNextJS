"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jun 1", value: 2400 },
  { date: "Jun 2", value: 1398 },
  { date: "Jun 3", value: 9800 },
  { date: "Jun 4", value: 3908 },
  { date: "Jun 5", value: 4800 },
  { date: "Jun 6", value: 3800 },
  { date: "Jun 7", value: 4300 },
];

export default function SalesChart() {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">Weekly Sales Overview</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ec4899"
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
