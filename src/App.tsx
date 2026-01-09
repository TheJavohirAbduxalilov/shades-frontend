import { Navigate, Route, Routes } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import OrderFormPage from './pages/OrderFormPage';
import OrderDetailPage from './pages/OrderDetailPage';
import TrackingPage from './pages/TrackingPage';
import WindowWizardPage from './pages/WindowWizardPage';
import WindowViewPage from './pages/WindowViewPage';
import SummaryPage from './pages/SummaryPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/track/:trackingCode" element={<TrackingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/orders/:orderId/windows/:windowId" element={<WindowViewPage />} />
          <Route path="/orders/:orderId/summary" element={<SummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/orders/new" element={<OrderFormPage />} />
          <Route path="/orders/:orderId/edit" element={<OrderFormPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['installer']} />}>
          <Route path="/orders/:orderId/windows/new" element={<WindowWizardPage />} />
          <Route path="/orders/:orderId/windows/:windowId/edit" element={<WindowWizardPage />} />
        </Route>
      </Routes>
      <BottomNav />
    </div>
  );
};

export default App;
