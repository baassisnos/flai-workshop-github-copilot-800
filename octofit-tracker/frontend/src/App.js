import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-5">
      <div className="octofit-hero">
        <img src={logo} alt="OctoFit logo" />
        <h1>OctoFit Tracker</h1>
        <p>Track activities, manage teams, and climb the leaderboard.</p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <NavLink to="/users" className="btn btn-primary btn-lg">Users</NavLink>
          <NavLink to="/teams" className="btn btn-success btn-lg">Teams</NavLink>
          <NavLink to="/activities" className="btn btn-warning btn-lg">Activities</NavLink>
          <NavLink to="/leaderboard" className="btn btn-danger btn-lg">Leaderboard</NavLink>
          <NavLink to="/workouts" className="btn btn-info btn-lg">Workouts</NavLink>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="OctoFit logo" />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/teams">Teams</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/activities">Activities</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/workouts">Workouts</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;

