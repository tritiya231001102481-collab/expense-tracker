
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#64748b",
];

function Charts({ transactions }) {
  // Pie chart data: expenses by category
  const categoryData = Object.values(
    transactions
      .filter((item) => item.type === "Expense")
      .reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            name: item.category,
            value: 0,
          };
        }

        acc[item.category].value += Number(item.amount);
        return acc;
      }, {})
  );

  // Bar chart data: income vs expenses
  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const barData = [
    { name: "Income", amount: income },
    { name: "Expense", amount: expenses },
  ];

  // Line chart data: daily expense trend
  const dailyData = Object.values(
    transactions
      .filter((item) => item.type === "Expense")
      .reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = {
            date: item.date,
            amount: 0,
          };
        }

        acc[item.date].amount += Number(item.amount);
        return acc;
      }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="charts-section">
      <h2 className="charts-title">Financial Analytics</h2>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Expenses by Category</h3>

          {categoryData.length === 0 ? (
            <p className="empty">No expense data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card chart-card">
          <h3>Income vs Expense</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Bar
                dataKey="amount"
                name="Amount"
                radius={[6, 6, 0, 0]}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card line-chart">
          <h3>Daily Expense Trend</h3>

          {dailyData.length === 0 ? (
            <p className="empty">No daily expense data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Daily Expense"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

export default Charts;
