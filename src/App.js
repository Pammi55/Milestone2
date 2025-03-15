//App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import FriendList from "./Components/FriendList";
import ExpenseList from "./Components/ExpenseList";
import ExpenseSummary from "./Components/ExpenseSummary";
import { ExpenseService } from "./Services/ExpenseService";
import { CalculationService } from "./Services/CalculatedServices";
import { FriendService } from "./Services/FriendService";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes using the 'element' prop */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/friends" element={<FriendList />} />
        <Route path="/expenses" element={<ExpenseList />} />
       {/* <Route path="/summary" element={<ExpenseSummary />} />*/}
      </Routes>
    </Router>
  );
}

export default App;