import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'

import App from './App.jsx'
import Home from './Home.jsx'
import Error from './Error.jsx'
import Customers from './components/Customers.jsx'
import Trainings from './components/Trainings.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        element: <Home />,
        index: true
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "trainings",
        element: <Trainings />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
