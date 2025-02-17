import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MovieDetailPage from './pages/MovieDetailPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/movie/:movieId' element={<MovieDetailPage/>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
