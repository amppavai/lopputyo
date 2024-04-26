import './App.css'
import React from 'react';
import { BrowserRouter as Router, NavLink, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';


function App() {

  return (
    <>
      <div className="App">
        <AppBar position="static">
          <Toolbar className="navigation">
            <Typography className="navigation">
              <NavLink to="/" activeclassname="active">Home</NavLink>
              <NavLink to="/customers" activeclassname="active">Customers</NavLink>
              <NavLink to="/trainings" activeclassname="active">Trainings</NavLink>
              <NavLink to="/calendar" activeclassname="active">Calendar</NavLink>
              <NavLink to="/chart" activeclassname="active">Chart</NavLink>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Outlet />
    </>
  );

}

export default App;
