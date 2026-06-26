const express = require("express");
const router = express.Router();


const {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);
module.exports = router;