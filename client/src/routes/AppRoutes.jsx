import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guards
import ProtectedRoute from '../components/shared/ProtectedRoute';
import RoleProtectedRoute from '../components/shared/RoleProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import AnnouncementsPage from '../pages/public/AnnouncementsPage';
import ElectionsInfoPage from '../pages/public/ElectionsInfoPage';
import ResultsPage from '../pages/public/ResultsPage';
import FaqPage from '../pages/public/FaqPage';
import ContactPage from '../pages/public/ContactPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenVerification from '../pages/citizen/CitizenVerification';
import CitizenProfile from '../pages/citizen/CitizenProfile';
import CitizenElections from '../pages/citizen/CitizenElections';
import CitizenElectionDetails from '../pages/citizen/CitizenElectionDetails';
import CitizenVote from '../pages/citizen/CitizenVote';
import VoteSuccess from '../pages/citizen/VoteSuccess';
import VotingHistory from '../pages/citizen/VotingHistory';
import CitizenAnnouncements from '../pages/citizen/CitizenAnnouncements';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCitizens from '../pages/admin/AdminCitizens';
import AdminElections from '../pages/admin/AdminElections';
import AdminCandidates from '../pages/admin/AdminCandidates';
import AdminResults from '../pages/admin/AdminResults';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminContacts from '../pages/admin/AdminContacts';
import AdminFaqs from '../pages/admin/AdminFaqs';

// AI Widget
import FloatingChatWidget from '../components/ai/FloatingChatWidget';

const AppRoutes = () => (
  <BrowserRouter>
    <FloatingChatWidget />
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/elections" element={<ElectionsInfoPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Citizen Protected */}
      <Route element={<ProtectedRoute><CitizenLayout /></ProtectedRoute>}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/verification" element={<CitizenVerification />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
        <Route path="/citizen/elections" element={<CitizenElections />} />
        <Route path="/citizen/elections/:id" element={<CitizenElectionDetails />} />
        <Route path="/citizen/elections/:id/vote" element={<CitizenVote />} />
        <Route path="/citizen/vote-success" element={<VoteSuccess />} />
        <Route path="/citizen/history" element={<VotingHistory />} />
        <Route path="/citizen/announcements" element={<CitizenAnnouncements />} />
      </Route>

      {/* Admin Protected */}
      <Route element={<RoleProtectedRoute allowedRoles={['admin']}><AdminLayout /></RoleProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/citizens" element={<AdminCitizens />} />
        <Route path="/admin/elections" element={<AdminElections />} />
        <Route path="/admin/candidates" element={<AdminCandidates />} />
        <Route path="/admin/results" element={<AdminResults />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
        <Route path="/admin/faqs" element={<AdminFaqs />} />
      </Route>

      {/* Redirects */}
      <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen text-center"><div><h1 className="text-3xl font-bold text-red-600">Access Denied</h1><p className="text-gray-600 mt-2">You don't have permission to view this page.</p></div></div>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
