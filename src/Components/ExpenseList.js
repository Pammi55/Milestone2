//ExpenseList.js
import React, { useState, useEffect } from "react";
import { ExpenseService } from "../Services/ExpenseService";
import { FriendService } from "../Services/FriendService";
import { CalculationService } from "../Services/CalculatedServices";


const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    payer: "",
    participants: [],
    date: "",
    splitType: "equal", // Equal or percentage
    customSplits: {},
    editing: false, // New state for tracking whether we are editing
    id: null, // To store the ID of the expense being edited
  });
  const [friends, setFriends] = useState(FriendService.getFriends());

  // Fetch expenses when component mounts
  useEffect(() => {
    const fetchedExpenses = ExpenseService.getExpenses() || [];
    setExpenses(fetchedExpenses);
  }, []);

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.description && newExpense.payer) {
      let participants = [];
      let customSplits = {};
  
      // Handle equal split
      if (newExpense.splitType === "equal") {
        participants = friends.map((friend) => ({
          name: friend.name,
          amount: newExpense.amount / friends.length, // Divide amount equally
        }));
      } else if (newExpense.splitType === "percentage") {
        // Handle percentage split
        const totalPercentage = Object.values(newExpense.customSplits).reduce(
          (sum, percentage) => sum + Number(percentage),
          0
        );
  
        // Ensure the total percentage is 100
        if (totalPercentage !== 100) {
          alert("The total percentage must add up to 100.");
          return;
        }
  
        // Calculate the custom share for each participant
        participants = friends.map((friend) => {
          const percentage = newExpense.customSplits[friend.name] || 0;
          return {
            name: friend.name,
            amount: (newExpense.amount * percentage) / 100,
          };
        });
      }
  
      // If we're editing an existing expense
      if (newExpense.editing && newExpense.id) {
        ExpenseService.updateExpense(newExpense.id, {
          ...newExpense,
          participants,
        });
      } else {
        // Save the expense with participants
        ExpenseService.addExpense({
          ...newExpense,
          participants,
        });
      }
  
      // Reset form after adding or editing
      setExpenses(ExpenseService.getExpenses());
      setNewExpense({
        amount: "",
        description: "",
        payer: "",
        participants: [],
        date: "",
        splitType: "equal",
        customSplits: {},
        editing: false,
        id: null,
      });
    } else {
      alert("Please fill out all fields.");
    }
  };
  

  // Handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value,
    });
  };

  // Handle participant changes (if the split type is custom)
  const handleParticipantChange = (friend, amount) => {
    setNewExpense({
      ...newExpense,
      customSplits: {
        ...newExpense.customSplits,
        [friend]: amount,
      },
    });
  };

  // Handle split type change
  const handleSplitChange = (e) => {
    setNewExpense({
      ...newExpense,
      splitType: e.target.value,
    });
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id) => {
    ExpenseService.deleteExpense(id);
    setExpenses(ExpenseService.getExpenses());
  };

  // Handle editing an expense
  const handleEditExpense = (expense) => {
    setNewExpense({
      ...expense,
      editing: true, // Mark as editing
      customSplits: expense.participants.reduce((acc, participant) => {
        acc[participant.name] = (participant.amount / expense.amount) * 100; // Set custom splits as percentages
        return acc;
      }, {}),
    });
  };

  const safeFriends = Array.isArray(friends) ? friends : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  // Calculate total expenses and balance summary
  const { totalAmount, balances } = CalculationService.calculateSummary(safeFriends, safeExpenses);

  // Calculate the summary for each participant based on the expenses
  const calculateSummary = () => {
    const summary = safeFriends.map((friend) => {
      let totalOwed = 0;

      // Loop through expenses to calculate how much each friend owes
      safeExpenses.forEach((expense) => {
        const participant = expense.participants.find((p) => p.name === friend.name);
        if (participant) {
          totalOwed += participant.amount;
        }
      });

      return {
        name: friend.name,
        amount: totalOwed,
      };
    });

    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="expense-list">
      <h3>Expense List</h3>

      {/* Expense Form */}
      <div className="expense-form">
        <input
          type="number"
          name="amount"
          value={newExpense.amount}
          onChange={handleInputChange}
          placeholder="Amount"
        />
        <input
          type="text"
          name="description"
          value={newExpense.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <select
          name="payer"
          value={newExpense.payer}
          onChange={handleInputChange}
        >
          <option value="">Select Payer</option>
          {safeFriends.map((friend) => (
            <option key={friend.id} value={friend.name}>
              {friend.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleInputChange}
        />
        <div>
          <label>
            <input
              type="radio"
              name="splitType"
              value="equal"
              checked={newExpense.splitType === "equal"}
              onChange={handleSplitChange}
            />
            Split equally
          </label>
          <label>
            <input
              type="radio"
              name="splitType"
              value="percentage"
              checked={newExpense.splitType === "percentage"}
              onChange={handleSplitChange}
            />
            Custom percentage split
          </label>
        </div>

        {/* If split type is percentage, allow input for each participant */}
        {newExpense.splitType === "percentage" && (
          <div>
            <h4>Enter the percentage split for each participant:</h4>
            {safeFriends.map((friend) => (
              <div key={friend.id}>
                <label>{friend.name}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newExpense.customSplits[friend.name] || ""}
                  onChange={(e) =>
                    handleParticipantChange(friend.name, e.target.value)
                  }
                  placeholder="Enter percentage"
                />
              </div>
            ))}
          </div>
        )}

        <button onClick={handleAddExpense}>
          {newExpense.editing ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      {/* Display added expenses */}
      <h4>Added Expenses</h4>
      {safeExpenses.length > 0 ? (
        <ul>
          {safeExpenses.map((expense) => (
            <li key={expense.id}>
              <div>
                <strong>{expense.description}</strong>
                <br />
                Amount: ${expense.amount}
                <br />
                Payer: {expense.payer}
                <br />
                Date: {expense.date}
                <br />
                Participants:
                {expense.participants.map((participant) => (
                  <div key={participant.name}>
                    {participant.name}: ${participant.amount.toFixed(2)}
                  </div>
                ))}
                <br />
                <button onClick={() => handleDeleteExpense(expense.id)}>
                  Delete
                </button>
                <button onClick={() => handleEditExpense(expense)}>
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses added yet.</p>
      )}

      {/* Display summary of amounts owed */}
      <h4>Summary</h4>
      <p>Total Expenses: ${totalAmount}</p>
      <ul>
        {summary.map((balance) => (
          <li key={balance.name}>
            {balance.name} owes: ${balance.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;