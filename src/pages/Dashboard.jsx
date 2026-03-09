import React from 'react';
import { useAuth } from '../context';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
      <p className="text-text-secondary mt-4">Coming soon...</p>
    </div>
  );
};

export default Dashboard;
