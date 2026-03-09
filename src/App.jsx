import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home, Marketplace, APIDetail, Pricing, Documentation, Dashboard, Auth } from './pages';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/api/:id" element={<APIDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Layout>
  );
}

export default App;
