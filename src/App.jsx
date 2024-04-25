import './App.css'
import React from 'react';
import { BrowserRouter as Router, NavLink, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import AddCustomer from './components/AddCustomer';

function App() {

  return (
    <>
      <div className="App">
        <h2>Welcome!</h2>
        <AppBar position="static">
          <Toolbar className="navigation">
            <Typography className="navigation">
              <NavLink to="/" activeclassname="active">Home</NavLink>
              <NavLink to="/customers" activeclassname="active">Customers</NavLink>
              <NavLink to="/trainings" activeclassname="active">Trainings</NavLink>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Outlet />
    </>
  );

}

export default App;
