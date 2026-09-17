import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'

import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Logistics from './pages/Logistics/Logistics.jsx'
import Environment from './pages/Environment/Environment.jsx'
import Infrastructure from './pages/Infrastructure/Infrastructure.jsx'
import EnergyPower from './pages/EnergyPower/EnergyPower.jsx'
import Profile from './pages/Profile/profile.jsx'
import Auth from './components/Auth/Auth.jsx'
import Edgecase from './components/Others/Edgecase.jsx'
import { ToastProvider } from "./components/context/ToastContext.jsx";
import Requisitions from './pages/Requisition/Requisitions.jsx'
import ResetPasswordPage from './components/Auth/resetpassword.jsx'

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
      
      {/* Assuming Home is a landing page. Logged-in users will bypass this */}
      <Route path='/' element={<PublicRoute><Home /></PublicRoute>} />
      
      {/* Catch manual visits to /login or /signup and push them to /auth */}
      <Route path='login' element={<Navigate to="/auth" replace />} />
      <Route path='signup' element={<Navigate to="/auth" replace />} />


      {/* ------------------------------------------- */}
      {/* 2. PROTECTED ROUTES (Dashboard & Apps)      */}
      {/* ------------------------------------------- */}

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='logistics' element={<Logistics />} />
        <Route path='environment' element={<Environment />} />
        <Route path='infrastructure' element={<Infrastructure />} />
        <Route path='energypower' element={<EnergyPower />} />
        <Route path='requisitions' element={<Requisitions />} />
        <Route path='profile' element={<Profile />} />
      </Route>
      <Route path='resetpassword' element={<ProtectedRoute><ResetPasswordPage /></ProtectedRoute>}></Route>


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