import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AllServices from './pages/AllServices';
import Mentorship from './pages/Mentorship';
import SignalServices from './pages/SignalServices';
import AccountManagement from './pages/AccountManagement';
import AccountManagementApplication from './pages/AccountManagementApplication';
import Investment from './pages/Investment';
import EvaluationAccounts from './pages/EvaluationAccounts';
import About from './pages/About';
import FAQPage from './pages/FAQPage';
import Checkout from './pages/Checkout';
import Terms from './pages/Terms';
import InvestmentTerms from './pages/InvestmentTerms';
import FreeResources from './pages/FreeResources';
import Markets from './pages/Markets';
import CopyTrading from './pages/CopyTrading';
import TopTraders from './pages/TopTraders';
import AIInsights from './pages/AIInsights';
import TradingTools from './pages/TradingTools';
import MarketNews from './pages/MarketNews';
import SettingsPage from './pages/Settings';
import EditProfile from './pages/EditProfile';
import DepositFunds from './pages/DepositFunds';
import Withdraw from './pages/Withdraw';
import Transfer from './pages/Transfer';
import SetTransferPin from './pages/SetTransferPin';
import Payment from './pages/Payment';
import Support from './pages/Support';
import Tickets from './pages/Tickets';
import Notifications from './pages/Notifications';
import Assets from './pages/Assets';
import Transactions from './pages/Transactions';
import InvestmentActivities from './pages/activities/InvestmentActivities';
import MentorshipActivities from './pages/activities/MentorshipActivities';
import SignalActivities from './pages/activities/SignalActivities';
import EvaluationActivities from './pages/activities/EvaluationActivities';
import AccountManagementActivities from './pages/activities/AccountManagementActivities';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <NotificationProvider>
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
          {/* All Routes are now Public */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="trade" element={<Trade />} />
            <Route path="dashboard" element={<Navigate to="/profile?tab=dashboard" replace />} />
            <Route path="trading-tools" element={<TradingTools />} />
            <Route path="market-news" element={<MarketNews />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={<Admin />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment" element={<Payment />} />
            <Route path="deposit-funds" element={<DepositFunds />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="set-transfer-pin" element={<SetTransferPin />} />
            
            {/* New Service Pages */}
            <Route path="services" element={<AllServices />} />
            <Route path="services/mentorship" element={<Mentorship />} />
            <Route path="services/signals" element={<SignalServices />} />
            <Route path="services/account-management" element={<AccountManagement />} />
            <Route path="account-management-application" element={<AccountManagementApplication />} />
            <Route path="services/investment" element={<Investment />} />
            <Route path="services/evaluation" element={<EvaluationAccounts />} />
            
            {/* New Platform Pages */}
            <Route path="markets" element={<Markets />} />
            <Route path="copy-trading" element={<CopyTrading />} />
            <Route path="top-traders" element={<TopTraders />} />
            <Route path="ai-insights" element={<AIInsights />} />
            
            {/* Information Pages */}
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="support" element={<Support />} />
            <Route path="support/tickets" element={<Tickets />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="assets" element={<Assets />} />
            <Route path="transactions" element={<Transactions />} />
            
            {/* Activity Pages */}
            <Route path="activities/investment" element={<InvestmentActivities />} />
            <Route path="activities/mentorship" element={<MentorshipActivities />} />
            <Route path="activities/signals" element={<SignalActivities />} />
            <Route path="activities/evaluation" element={<EvaluationActivities />} />
            <Route path="activities/account-management" element={<AccountManagementActivities />} />
            
            <Route path="terms" element={<Terms />} />
            <Route path="investment-terms" element={<InvestmentTerms />} />
            <Route path="free-resources" element={<FreeResources />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
