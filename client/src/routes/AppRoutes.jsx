import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../features/auth/login/LoginPage";
import SignUpPage from "../features/auth/signup/SignUpPage";
import ProfilePage from "../features/user/profile/Profile";
import VerifyEmailPage from "../features/auth/verifyEmail/VerifyEmailPage";
import ForgetPasswordPage from "../features/auth/forget_password/ForgetPasswordPage";
import ResetPasswordPage from "../features/auth/ResetPassword/ResetPasswordPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../features/user/Dashboard/Dashboard";
import ProfileTab from "../features/user/Dashboard/components/ProfileTab";
import JoinedClasses from "../features/user/Dashboard/components/JoinedClasses";
import CreatedClasses from "../features/user/Dashboard/components/CreatedClasses";
import ClassDashboard from "../features/classroom/ClassDashboard";


const router = createBrowserRouter([
    {
        path: '/',
        element: (<PublicRoute><LandingPage/></PublicRoute>)
    },
    {
        path: '/login',
        element: (
        <PublicRoute>
            <LoginPage/>
        </PublicRoute>
        )
    },
    {
        path: '/signup',
        element: (
        <PublicRoute>
            <SignUpPage/>
        </PublicRoute>
        )
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard/>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <ProfileTab/>
            },
            {
                path: 'profile',
                element: <ProfileTab/>
            },
            {
                path: 'joined-classes',
                element: <JoinedClasses/>
            },
            {
                path: 'created-classes',
                element: <CreatedClasses/>
            }
        ]
    },
    {
        path: '/verify-email',
        element: (
        <PublicRoute>
            <VerifyEmailPage/>
        </PublicRoute>)
    },
    {
        path: '/forget-password',
        element: (
        <PublicRoute>
            <ForgetPasswordPage/>
        </PublicRoute>)
    },
        {
        path: '/reset-password/:resetPasswordToken',
        element: (
        <PublicRoute>
            <ResetPasswordPage/>
        </PublicRoute>)
    },
    {
        path: '/class/:enrollmentId',
        element: (
        <ProtectedRoute>
            <ClassDashboard/>
        </ProtectedRoute>)
    }
])

export default router;