//ExpenseService.js

let expenses = [];

export const ExpenseService = {
  // Get all expenses
  getExpenses() {
    return expenses;
  },

  // Add an expense
  addExpense(expense) {
    expenses.push({
      ...expense,
      id: Date.now(),
    });
  },

  // Delete an expense by its id
  deleteExpense(id) {
    expenses = expenses.filter((expense) => expense.id !== id);
  },

 updateExpense(id, updatedExpense) {
    // Logic to update the expense with the given id
    // Example: Find the expense by id and update its details.
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);
    if (expenseIndex !== -1) {
      expenses[expenseIndex] = updatedExpense;
    }
  }
};