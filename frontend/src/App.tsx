import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import CustomCursor from './components/CustomCursor'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import SchedulePage from './pages/SchedulePage'
import RoomsPage from './pages/RoomsPage'
import EventsPage from './pages/EventsPage'
import SettingsPage from './pages/SettingsPage'
import AdminPage from './pages/AdminPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((s) => s.user)
    if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
    return <>{children}</>
}

export default function App() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    return (
        <>
            <CustomCursor />
            <Routes>
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/rooms" element={<RoomsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminPage />
                            </AdminRoute>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
            </Routes>
        </>
    )
}
