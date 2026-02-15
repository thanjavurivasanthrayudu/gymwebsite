import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTrainers from './pages/admin/ManageTrainers';
import ManageMembers from './pages/admin/ManageMembers';
import ManagePayments from './pages/admin/ManagePayments';
import ManageWorkouts from './pages/admin/ManageWorkouts';

import TrainerDashboard from './pages/trainer/TrainerDashboard';
import AssignPlans from './pages/trainer/AssignPlans';
import MemberProgress from './pages/trainer/MemberProgress';

import MemberDashboard from './pages/member/MemberDashboard';
import WorkoutPlan from './pages/member/WorkoutPlan';
import DietPlan from './pages/member/DietPlan';
import WorkoutLibrary from './pages/member/WorkoutLibrary';
import PaymentHistory from './pages/member/PaymentHistory';
import Profile from './pages/member/Profile';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Admin */}
                    <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="trainers" element={<ManageTrainers />} />
                        <Route path="members" element={<ManageMembers />} />
                        <Route path="payments" element={<ManagePayments />} />
                        <Route path="workouts" element={<ManageWorkouts />} />
                    </Route>

                    {/* Trainer */}
                    <Route path="/trainer" element={<ProtectedRoute roles={['trainer']}><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<TrainerDashboard />} />
                        <Route path="assign-plans" element={<AssignPlans />} />
                        <Route path="progress" element={<MemberProgress />} />
                    </Route>

                    {/* Member */}
                    <Route path="/member" element={<ProtectedRoute roles={['member']}><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<MemberDashboard />} />
                        <Route path="workout-plan" element={<WorkoutPlan />} />
                        <Route path="diet-plan" element={<DietPlan />} />
                        <Route path="library" element={<WorkoutLibrary />} />
                        <Route path="payments" element={<PaymentHistory />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
