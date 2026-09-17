
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserAuthProvider from './context/UserAuthContext.jsx'




createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>

    </BrowserRouter>

  </>,
)
