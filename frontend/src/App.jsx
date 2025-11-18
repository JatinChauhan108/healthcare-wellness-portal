import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { Outlet } from "react-router-dom"
import {LogIn } from 'lucide-react';

function App() {

  return (
    <>
      <div className="bg-gray-50 min-h-screen flex">
        <NavBar />
        

        <main className="flex-1 ml-64 p-6 md:p-12">

           <div className="flex justify-end mb-8">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:text-emerald-600 transition-all">
            <LogIn size={18} />
            <span>Register / Login</span>
          </button>
        </div>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
