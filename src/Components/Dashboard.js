// Dashboard.js
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Expense Splitter Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/friends">Manage Friends</Link></li>
          <li><Link to="/expenses">Manage Expenses AND View Summary</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;