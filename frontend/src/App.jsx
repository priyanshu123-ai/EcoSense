import React from 'react'

import {Route, Routes} from "react-router-dom"
import Home from './pages/Home'
import Register from './pages/Register'
import Routeing from './pages/Route'
import "./leafletFix";
import EcoBot from './pages/EcoBot'
import Login from './pages/Login'
import Dasboard from './components/Dasboard'
import Questionnaire from './pages/Questionnaire'
import EcoProducts from './pages/EcoProduct'
import PollutionSources from './pages/PollutionSources'
import Profile from './pages/Profile'



const App = () => {
  return (
    <div>
   
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/routes' element={<Routeing />}/>
        <Route path='/chat' element = {<EcoBot />}/>
        <Route path='/login' element = {<Login />}/>
        <Route path='/dashboard' element={<Dasboard />}/>
        <Route path='/questionnaire' element = {<Questionnaire />}/>

        <Route path='/recommendations' element = {<EcoProducts />}/>
        <Route path='/pollution' element = {<PollutionSources />}/>
        <Route path='/profile' element={<Profile />}/>
        

      </Routes>
    </div>
  )
}

export default App