import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header, Footer } from './components';
import { HomePage, LoginPage, RegisterPage, DashboardPage } from './pages';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Dashboard Layout Component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              
              <Route path="/login" element={
                <LoginPage />
              } />
              
              <Route path="/register" element={
                <RegisterPage />
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Add more routes as needed */}
              <Route path="/analysis" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Financial Analysis</h1>
                      <p>Analysis page coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/forecasting" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Financial Forecasting</h1>
                      <p>Forecasting page coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Financial Reports</h1>
                      <p>Reports page coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Settings</h1>
                      <p>Settings page coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Profile</h1>
                      <p>Profile page coming soon...</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Static Pages */}
              <Route path="/about" element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      About FinClick.AI
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      FinClick.AI is a cutting-edge financial analysis platform that leverages artificial intelligence 
                      to provide comprehensive insights into financial data. Our mission is to democratize financial 
                      analysis and make sophisticated financial tools accessible to businesses of all sizes.
                    </p>
                  </div>
                </Layout>
              } />
              
              <Route path="/features" element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      Features
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Discover the powerful features that make FinClick.AI the leading choice for financial analysis.
                    </p>
                  </div>
                </Layout>
              } />
              
              <Route path="/pricing" element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      Pricing Plans
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Choose the perfect plan for your business needs.
                    </p>
                  </div>
                </Layout>
              } />
              
              <Route path="/contact" element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      Contact Us
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Get in touch with our team for support and inquiries.
                    </p>
                  </div>
                </Layout>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                      404
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                      Page not found
                    </p>
                    <a
                      href="/"
                      className="inline-block bg-primary-gold text-primary-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Go back home
                    </a>
                  </div>
                </Layout>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
