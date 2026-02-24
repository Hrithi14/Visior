import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Appclinc from './Appclinc.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Appclinc />
  </StrictMode>,
)
