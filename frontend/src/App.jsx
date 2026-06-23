import { useState } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editId, setEditId] = useState(null);

  const saveExpenses = (data) => {
    setExpenses(data);
    localStorage.setItem("expenses", JSON.stringify(data));
  };

  const addExpense = () => {
    if (!title || !amount || !date) return;

    if (editId !== null) {
      const updatedExpenses = expenses.map((expense) =>
        expense.id === editId
          ? {
              ...expense,
              title,
              amount: Number(amount),
              category,
              date,
            }
          : expense
      );

      saveExpenses(updatedExpenses);
      setEditId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        category,
        date,
      };

      saveExpenses([...expenses, newExpense]);
    }

    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };

  const editExpense = (expense) => {
    setEditId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== id
    );

    saveExpenses(updatedExpenses);

    if (editId === id) {
      setEditId(null);
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate("");
    }
  };

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => expense.amount))
      : 0;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      expense.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h1>Expense Tracker 💰</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Expense name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Education</option>
          <option>Other</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={addExpense}>
          {editId !== null
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </div>

      <div className="dashboard">
        <div className="stat">
          <h3>Total Spent</h3>
          <p>₹{total}</p>
        </div>

        <div className="stat">
          <h3>Transactions</h3>
          <p>{expenses.length}</p>
        </div>

        <div className="stat">
          <h3>Highest Expense</h3>
          <p>₹{highestExpense}</p>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search expense..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value)
          }
        >
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Education</option>
          <option>Other</option>
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        filteredExpenses.map((expense) => (
          <div
            className="expense"
            key={expense.id}
          >
            <div>
              <h3>{expense.title}</h3>

              <p>
                ₹{expense.amount} • {expense.category}
              </p>

              <small>{expense.date}</small>
            </div>

            <div>
              <button
                onClick={() => editExpense(expense)}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteExpense(expense.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;