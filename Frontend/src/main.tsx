import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Taskapp from './tasksapp.tsx'
import './tailwind.css'; // Import Tailwind CSS


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Taskapp />
  </StrictMode>,
)
