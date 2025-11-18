import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import InfoPage from './pages/InfoPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/' element = {<App />}>

      <Route path = '/' element = {<InfoPage />} />

      {/* <Route path = '/login' element = {
        <AuthLayout authentication = {false}>
          <Login />
        </AuthLayout>
      } />

      <Route path = '/signup' element = {
        <AuthLayout authentication = {false}>
          <Signup />
        </AuthLayout>
        } />

      <Route path = '/edit-post/:slug' element = {
        <AuthLayout>
          <EditPost />
        </AuthLayout>
        } />

      <Route path = '/all-posts' element = {
        <AuthLayout>
          <AllPosts />
        </AuthLayout>
        } />
 */}
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
