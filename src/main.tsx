import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Question from './components/questions'
/*import App from './App.tsx'
<App />
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Question playerName='ugo'/>
  </StrictMode>,
)
