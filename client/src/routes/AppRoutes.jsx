import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card p-12 text-center animate-fade-in">
              <h1 className="text-5xl font-display font-bold gradient-text mb-4">
                Remote Voting System
              </h1>
              <p className="text-surface-400 text-lg">
                Enterprise-grade secure voting platform
              </p>
              <div className="mt-8 flex gap-4 justify-center">
                <button className="btn-primary">Get Started</button>
                <button className="btn-secondary">Learn More</button>
              </div>
            </div>
          </div>
        }
      />
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card p-12 text-center animate-fade-in">
              <h1 className="text-6xl font-display font-bold text-primary-400 mb-4">404</h1>
              <p className="text-surface-400 text-lg">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
