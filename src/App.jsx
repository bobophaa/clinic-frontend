import AppRoutes from './routes/AppRoutes'

import { ToastProvider } from './context/ToastContext'




function App() {
  return <AppRoutes />
}
<ToastProvider>
  <App />
</ToastProvider>

export default App
