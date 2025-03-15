//CalculationService.js

export const CalculationService = {
    calculateSummary: (friends, expenses) => {
      // Ensure friends and expenses are defined and are arrays
      if (!Array.isArray(friends) || !Array.isArray(expenses)) {
        return {
          totalAmount: 0,
          balances: [],
        };
      }
  
      // Calculate total expenses
      const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  
      // Initialize balances for each friend
      const balances = friends.map((friend) => {
        let totalOwed = 0;
  
        // Iterate over each expense and calculate how much each friend owes
        expenses.forEach((expense) => {
          if (expense.splitType === "equal") {
            const splitAmount = expense.amount / expense.participants.length;
            if (expense.participants.includes(friend.name)) {
              totalOwed += splitAmount;
            }
          }
  
          if (expense.splitType === "percentage") {
            const splitAmount = expense.customSplits[friend.name] || 0;
            totalOwed += (splitAmount / 100) * expense.amount;
          }
        });
  
        return {
          id: friend.id,
          name: friend.name,
          amount: totalOwed,
        };
      });
  
      return {
        totalAmount,
        balances,
      };
    },
  };