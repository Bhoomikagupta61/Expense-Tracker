import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [editId, setEditId] = useState(null);


  // Fetch expenses from backend
  useEffect(() => {
    fetch("http://localhost:5050/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.log(error));
  }, []);


  const addExpense = () => {
    if (!title || !amount || !date) return;


    const expenseData = {
      title,
      amount: Number(amount),
      category,
      date,
    };


    // Add expense
    if (editId === null) {
      fetch("http://localhost:5050/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      })
        .then((res) => res.json())
        .then((data) => {
          setExpenses([...expenses, data]);
        });

    } else {

      // temporary edit logic (backend update later)
      const updatedExpenses = expenses.map((expense) =>
        expense._id === editId
          ? { ...expense, ...expenseData }
          : expense
      );

      setExpenses(updatedExpenses);
      setEditId(null);
    }


    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };


  const editExpense = (expense) => {
    setEditId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
  };


  const deleteExpense = (id) => {

    // temporary delete from UI
    const updatedExpenses = expenses.filter(
      (expense) => expense._id !== id
    );

    setExpenses(updatedExpenses);

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
          onChange={(e)=>setCategory(e.target.value)}
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
          onChange={(e)=>setDate(e.target.value)}
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
          onChange={(e)=>setSearch(e.target.value)}
        />


        <select
          value={filterCategory}
          onChange={(e)=>setFilterCategory(e.target.value)}
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

        filteredExpenses.map((expense)=>(


          <div
            className="expense"
            key={expense._id}
          >


            <div>

              <h3>{expense.title}</h3>

              <p>
                ₹{expense.amount} • {expense.category}
              </p>


             <small>
                {new Date(expense.date).toLocaleDateString()}
            </small>


            </div>



            <div>


              <button
                onClick={()=>editExpense(expense)}
              >
                Edit
              </button>



              <button
                onClick={()=>deleteExpense(expense._id)}
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