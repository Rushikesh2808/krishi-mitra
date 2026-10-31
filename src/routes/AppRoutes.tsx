import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LoginPage } from '../modules/auth/LoginPage';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { FpoDashboardPage } from '../modules/fpo/FpoDashboardPage';
import { BuyerDashboardPage } from '../modules/buyer/BuyerDashboardPage';
import { CropSelectionPage } from '../modules/crop-selection/CropSelectionPage';
import { MarketComparisonPage } from '../modules/market-comparison/MarketComparisonPage';
import { PriceForecastPage } from '../modules/price-forecast/PriceForecastPage';
import { SellRecommendationsPage } from '../modules/sell-recommendations/SellRecommendationsPage';
import { NetEarningsPage } from '../modules/net-earnings/NetEarningsPage';
import { FpoMarketplacePage } from '../modules/fpo-marketplace/FpoMarketplacePage';
import { BuyerNegotiationsPage } from '../modules/buyer-negotiations/BuyerNegotiationsPage';
import { ProfilePage } from '../modules/profile/ProfilePage';
import { SettingsPage } from '../modules/settings/SettingsPage';
import { NotificationsPage } from '../modules/notifications/NotificationsPage';
import { NotFoundPage } from '../modules/common/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login & Role Selection Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside App Shell Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Farmer Root Dashboard (Role Protected for FARMER) */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['FARMER']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* FPO Dashboard (Role Protected for FPO) */}
          <Route
            path="fpo"
            element={
              <ProtectedRoute allowedRoles={['FPO']}>
                <FpoDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Buyer Dashboard (Role Protected for BUYER) */}
          <Route
            path="buyer"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <BuyerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Advisory & Core Modules */}
          <Route path="crop-selection" element={<CropSelectionPage />} />
          <Route path="market-comparison" element={<MarketComparisonPage />} />
          <Route path="price-forecast" element={<PriceForecastPage />} />
          <Route path="sell-recommendations" element={<SellRecommendationsPage />} />
          <Route path="net-earnings" element={<NetEarningsPage />} />
          <Route path="fpo-marketplace" element={<FpoMarketplacePage />} />
          <Route path="buyer-negotiations" element={<BuyerNegotiationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
