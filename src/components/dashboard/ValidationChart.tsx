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

const COLORS = ["hsl(166, 72%, 40%)", "hsl(38, 92%, 50%)", "hsl(217, 91%, 60%)", "hsl(280, 65%, 60%)", "hsl(340, 75%, 55%)"];

export function ValidationChart({ data, type = "bar" }: ValidationChartProps) {
  const chartData = data.municipalities.slice(0, 10).map((m) => ({
    name: m.municipality.length > 12 ? m.municipality.substring(0, 12) + "..." : m.municipality,
    fullName: m.municipality,
    Target: m.target,
    "1st Batch": m.totalValidated1stBatch,
    Buffer: m.totalValidatedBuffer,
    Validated: m.overallTotalValidated,
  }));

  const pieData = [
    {
      name: "1st Batch Validated",
      value: data.grandTotal.totalValidated1stBatch,
    },
    {
      name: "Buffer Validated",
      value: data.grandTotal.totalValidatedBuffer,
    },
    {
      name: "Existing WGP",
      value: data.grandTotal.existingWGP,
    },
    {
      name: "4Ps Refused",
      value: data.grandTotal.active4psRefused,
    },
    {
      name: "Remaining Variance",
      value: Math.max(0, data.grandTotal.variance - data.grandTotal.existingWGP - data.grandTotal.active4psRefused),
    },
  ];

  if (type === "pie") {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Validation Distribution
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Breakdown of validation status
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
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
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Validation by Municipality
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Top 10 municipalities comparison
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
            <Bar dataKey="Validated" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
