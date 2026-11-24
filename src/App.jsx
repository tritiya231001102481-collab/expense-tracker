
import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import Summary from "./components/Summary";
import Charts from "./components/Charts";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("transactions")) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Save data in localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add transaction
  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      { ...transaction, id: crypto.randomUUID() },
      ...prev,
    ]);
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesType =
        type === "All" || item.type === type;

      const matchesMonth = item.date.startsWith(month);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesMonth
      );
    });
  }, [transactions, search, category, type, month]);

  // Calculate summary
  const income = filteredTransactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = filteredTransactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expenses;

  // Export CSV
  const exportCSV = () => {
    const headers = ["Title", "Amount", "Type", "Category", "Date"];

    const rows = filteredTransactions.map((item) => [
      item.title,
      item.amount,
      item.type,
      item.category,
      item.date,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) =>
          `"${String(value).replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "expense-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>💰 Expense Tracker</h1>
          <p>Manage your money smartly</p>
        </div>

        <button className="export-btn" onClick={exportCSV}>
          ⬇ Export CSV
        </button>
      </header>

      <main>
        <Summary
          income={income}
          expenses={expenses}
          balance={balance}
        />

        <div className="top-grid">
          <ExpenseForm onAdd={addTransaction} />

          <section className="card filter-card">
            <h2>Search & Filter</h2>

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label>Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />

            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option>Food</option>
              <option>Shopping</option>
              <option>Travel</option>
              <option>Bills</option>
              <option>Health</option>
              <option>Education</option>
              <option>Salary</option>
              <option>Business</option>
              <option>Other</option>
            </select>

            <label>Transaction Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </section>
        </div>

        <Charts transactions={filteredTransactions} />

        <section className="card transactions">
          <div className="section-heading">
            <h2>Recent Transactions</h2>
            <span>{filteredTransactions.length} records</span>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="empty">No transactions found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`type ${item.type.toLowerCase()}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className={
                        item.type === "Income" ? "positive" : "negative"
                      }>
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTransaction(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>Expense Tracker | Built with React.js</p>
      </footer>
    </div>
  );
}

export default App;
