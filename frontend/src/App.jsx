import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Home from "./pages/home/Home";
import Dashboard from "./pages/Dashboard";
import "./styles/index.scss";

function Layout() {
  return (
    <div className="h-screen bg-black text-white">
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/:projectId" element={<Home />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}
