
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import { TaskProvider } from './TaskContext/TaskContext.jsx';
import AttendanceProvider from './attanceContext/AttadanceContext.jsx';
import ChatProvider from './Chatcontext/ChateContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TaskProvider>
        <AttendanceProvider>
          <ChatProvider> 
             <App />
          </ChatProvider>

        </AttendanceProvider>
      </TaskProvider>
    </AuthProvider>
  </StrictMode>
);
