import './App.css'
import React from 'react';
import { BrowserRouter as Router, Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';

function App() {

  return (
    <>
      <div className="App">
        <AppBar position="static">
          <Toolbar className="navigation">
            <Typography className="navigation">
              <Link to="/">Home</Link>
              <Link to="customers">Customers</Link>
              <Link to="trainings">Trainings</Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <Outlet />
      </div>
    </>
  );

}

export default App;
