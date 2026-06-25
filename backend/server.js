const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker API Running...");
});
app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});
const PORT = 5050;
app.use("/api/expenses", expenseRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});