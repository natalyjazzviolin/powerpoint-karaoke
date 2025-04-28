import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import type { Slide } from "../types/deck";

interface ChartIslandProps {
  slide: Slide;
}

export default function ChartIsland({ slide }: ChartIslandProps) {
  if (!slide.chart || !slide.chart.data) {
    return null;
  }

  const { type, data } = slide.chart;
  // ✅ TS now knows data has labels and values
  const chartData = data.labels.map((label, idx) => ({
    name: label,
    value: data.values[idx],
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={chartData} layout="horizontal">
            <LabelList dataKey="label" position="top" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" />
          </BarChart>
        ) : type === "pie" ? (
          <PieChart layout="horizontal">
            <LabelList dataKey="label" position="outside" />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        ) : type === "line" ? (
          <LineChart data={chartData} layout="horizontal">
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        ) : (
          <div className="text-red-500">Unsupported chart type</div>
        )}
      </ResponsiveContainer>
    </div>
  );
}
