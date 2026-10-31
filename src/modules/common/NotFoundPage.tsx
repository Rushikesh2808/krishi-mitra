import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-earth-100 text-earth-800 flex items-center justify-center font-bold text-2xl">
        404
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The requested page could not be located. Return to the farmer dashboard.
        </p>
      </div>
      <NavLink
        to="/"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-semibold shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </NavLink>
    </div>
  );
};

