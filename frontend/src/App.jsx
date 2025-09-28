import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Dashboard from './pages/Dashboard';
import './styles/index.scss';

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route path="/:projectId" element={<Home />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
