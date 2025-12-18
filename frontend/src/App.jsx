import React from 'react'

import {Route, Routes} from "react-router-dom"
import Home from './pages/Home'
import Register from './pages/Register'
import Routeing from './pages/Route'
import "./leafletFix";



const App = () => {
  return (
    <div>
   
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/routes' element={<Routeing />}/>
        

      </Routes>
    </div>
  )
}

export default App