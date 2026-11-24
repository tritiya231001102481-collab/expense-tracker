
function Summary({ income, expenses, balance }) {
  const cards = [
    {
      title: "Total Income",
      amount: income,
      icon: "📈",
      color: "income",
    },
    {
      title: "Total Expenses",
      amount: expenses,
      icon: "📉",
      color: "expense",
    },
    {
      title: "Total Balance",
      amount: balance,
      icon: "💰",
      color: "balance",
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <div className={`summary-card ${card.color}`} key={card.title}>
          <div>
            <p>{card.title}</p>
            <h2>
              ₹{card.amount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          <span className="summary-icon">{card.icon}</span>
        </div>
      ))}
    </section>
  );
}

export default Summary;
