//ExpenseSummary.js

import React from "react";
import { CalculationService } from "../Services/CalculatedServices";

const ExpenseSummary = ({ friends, expenses }) => {
  // Calculate the total expenses and balances using CalculationService
  const { totalAmount, balances } = CalculationService.calculateSummary(friends, expenses);

 // Ensure that balances is not undefined or null before rendering
  if (!balances || balances.length === 0) {
    return (
      <div className="expense-summary">
        <h3>Expense Summary</h3>
        <p>No expenses to summarize.</p>
      </div>
    );
  }

  return (
    <div className="expense-summary">
      <h3>Expense Summary</h3>
      {/* Display total expenses */}
      <p>Total Expenses: ${totalAmount.toFixed(2)}</p>

      {/* Display balance summary of amounts owed */}
      <ul>
        {balances.map((balance) => (
          <li key={balance.id}>
            {balance.name} owes: ${balance.amount.toFixed(2)}
          </li>
        ))}
      </ul>

      {/* Display participants for each expense */}
      <h4>Participants in each expense</h4>
      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div>
                <strong>{expense.description}</strong>
                <br />
                Amount: ${expense.amount.toFixed(2)}
                <br />
                Payer: {expense.payer}
                <br />
                Date: {expense.date}
                <br />
                <h5>Participants:</h5>
                <ul>
                  {expense.participants.map((participant) => (
                    <li key={participant.name}>
                      {participant.name}: ${participant.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses added yet.</p>
      )}
    </div>
  );
};

export default ExpenseSummary;