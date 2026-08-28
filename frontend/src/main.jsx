import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Logistics from './pages/Logistics/Logistics.jsx'
import Environment from './pages/Environment/Environment.jsx'
import Infrastructure from './pages/Infrastructure/Infrastructure.jsx'
import EnergyPower from './pages/EnergyPower/EnergyPower.jsx'
import Edgecase from './components/Others/Edgecase.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes WITH Layout */}
      <Route path='/' element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path='Logistics' element={<Logistics />} />
      <Route path='Environment' element={<Environment />} />
      <Route path='Infrastructure' element={<Infrastructure />} />
      <Route path='EnergyPower' element={<EnergyPower />} />

      
      </Route>
      <Route path='*' element={<Edgecase />} />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <ToastProvider> */}
      <RouterProvider router={router} />
    {/* </ToastProvider> */}
  </React.StrictMode>,
)