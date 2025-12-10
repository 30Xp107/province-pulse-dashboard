import { ProvinceData } from "@/data/provinceData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ValidationChartProps {
  data: ProvinceData;
  type?: "bar" | "pie";
}

const COLORS = ["hsl(166, 72%, 40%)", "hsl(38, 92%, 50%)"];

export function ValidationChart({ data, type = "bar" }: ValidationChartProps) {
  const chartData = data.municipalities.map((m) => ({
    name: m.municipality.length > 12 ? m.municipality.substring(0, 12) + "..." : m.municipality,
    fullName: m.municipality,
    Target: m.target,
    "System Result": m.systemResult,
    "System Variance": m.systemVariance,
  }));

  const pieData = [
    {
      name: "System Result",
      value: data.grandTotal.systemResult,
    },
    {
      name: "System Variance",
      value: data.grandTotal.systemVariance,
    },
  ];

  if (type === "pie") {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Target Completion
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          System Result vs Remaining Variance
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [value.toLocaleString(), ""]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-primary/10">
            <p className="text-2xl font-bold text-primary">
              {Math.round((data.grandTotal.systemResult / data.grandTotal.target) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Achievement Rate</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10">
            <p className="text-2xl font-bold text-warning">
              {data.grandTotal.systemVariance.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Target vs System Result
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Comparison by municipality
      </p>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [value.toLocaleString(), ""]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.fullName;
                }
                return label;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="Target" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="System Result" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
