
import { useState } from "react";

function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert("Please enter valid transaction details!");
      return;
    }

    onAdd({
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    });

    setTitle("");
    setAmount("");
    setType("Expense");
    setCategory("Food");
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <section className="card">
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>
        <label>Transaction Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Transaction Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
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

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">
          + Add Transaction
        </button>
      </form>
    </section>
  );
}

export default ExpenseForm;
