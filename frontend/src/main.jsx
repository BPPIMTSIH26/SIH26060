import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'

import Layout from './Layout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Logistics from './pages/Logistics/Logistics.jsx'
import Environment from './pages/Environment/Environment.jsx'
import Infrastructure from './pages/Infrastructure/Infrastructure.jsx'
import EnergyPower from './pages/EnergyPower/EnergyPower.jsx'
import Auth from './components/Auth/Auth.jsx'
import Edgecase from './components/Others/Edgecase.jsx'
import { ToastProvider } from "./components/context/ToastContext.jsx";
import Requisitions from './pages/Requisition/Requisitions.jsx'

// Import your newly created route protectors
import ProtectedRoute from './components/context/ProtectedRoute.jsx' 
import PublicRoute from './components/context/PublicRoute.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ------------------------------------------- */}
      {/* 1. PUBLIC ROUTES & REDIRECTS                */}
      {/* ------------------------------------------- */}
      
      {/* Wrap Auth in PublicRoute so logged-in users get bounced to the dashboard */}
      <Route path='auth' element={<PublicRoute><Auth /></PublicRoute>} />
      
      {/* Catch manual visits to /login or /signup and push them to /auth */}
      <Route path='login' element={<Navigate to="/auth" replace />} />
      <Route path='signup' element={<Navigate to="/auth" replace />} />


      {/* ------------------------------------------- */}
      {/* 2. PROTECTED ROUTES (Dashboard & Apps)      */}
      {/* ------------------------------------------- */}
      
      {/* Wrap the Layout in ProtectedRoute to secure EVERYTHING inside it */}
      <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path='Logistics' element={<Logistics />} />
        <Route path='Environment' element={<Environment />} />
        <Route path='Infrastructure' element={<Infrastructure />} />
        <Route path='EnergyPower' element={<EnergyPower />} />
        <Route path='shop' element={<Requisitions />} />
      </Route>


      {/* Catch-all for 404 Pages */}
      <Route path='*' element={<Edgecase />} />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
    <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>,
)