import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import './style/app.css'
import ChatWindow from './components/llm'
import ChatWidget from './components/llm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Router />
	<ChatWidget />
    </BrowserRouter>
  </React.StrictMode>,
)


