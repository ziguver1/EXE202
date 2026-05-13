import React, { useState } from 'react';
import { Home, Search, PlusCircle, User, X, CheckCircle2, Wallet, Activity } from 'lucide-react';
import { useApp, DEMO_WORKER } from '../context/AppContext';
import { useLocation, useNavigate, Link, Outlet } from 'react-router';
import { SnapOnLogo } from './SnapOnLogo';
import { AnimatePresence, motion } from 'motion/react';
import { WalletModal } from './WalletModal';

export function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setUserRole, workerStatus, jobs, workerCurrentJobId, hirerWallet, workerWallet, topUpWallet } = useApp();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const isWorker = currentUser.role === 'worker';
  const isAdmin = currentUser.role === 'admin';
  const walletBalance = isWorker ? workerWallet : hirerWallet;

  const formatWallet = (n: number) => n.toLocaleString('vi-VN') + '₫';

  // Pages that belong exclusively to each role
  const HIRER_ONLY = ['/post'];
  const WORKER_ONLY = ['/worker'];
  const ADMIN_ONLY = ['/admin'];

  const handleSwitchRole = (role: 'hirer' | 'worker' | 'admin') => {
    setUserRole(role);
    setShowSwitcher(false);
    if (role === 'worker') {
      // If currently on a hirer-only page, redirect to worker dashboard
      if (HIRER_ONLY.some(p => location.pathname.startsWith(p)) || ADMIN_ONLY.some(p => location.pathname.startsWith(p))) {
        navigate('/worker');
      }
    } else if (role === 'admin') {
      // Redirect to admin panel
      navigate('/admin');
    } else {
      // If currently on a worker-only or admin page, redirect to home
      if (WORKER_ONLY.some(p => location.pathname.startsWith(p)) || ADMIN_ONLY.some(p => location.pathname.startsWith(p))) {
        navigate('/');
      }
    }
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: isWorker ? '/worker' : '/post', label: isWorker ? 'Tìm việc' : 'Đăng việc', icon: isWorker ? Search : PlusCircle },
    { path: '/profile', label: 'Hồ sơ', icon: User },
  ];

  const currentJob = workerCurrentJobId ? jobs.find(j => j.id === workerCurrentJobId) : null;

  const ACCOUNTS = [
    {
      role: 'hirer' as const,
      name: 'Nguyễn Thị Hoa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguoiDung1',
      subtitle: 'Người thuê việc',
      color: 'orange',
      badge: '🏠 Thuê người',
      desc: 'Đăng việc, chọn người, xác nhận hoàn thành',
    },
    {
      role: 'worker' as const,
      name: DEMO_WORKER.name,
      avatar: DEMO_WORKER.avatar,
      subtitle: 'Người tìm việc',
      color: 'blue',
      badge: '💼 Làm việc',
      desc: 'Xem danh sách việc, ứng tuyển, nhận thù lao',
    },
    {
      role: 'admin' as const,
      name: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser2024',
      subtitle: 'Quản trị viên',
      color: 'purple',
      badge: '⚙️ Admin',
      desc: 'Quản lý hệ thống, jobs, users và thống kê',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Sidebar removed for Hirer/Worker */}

      {/* Account Switcher Modal */}
      <AnimatePresence>
        {showSwitcher && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSwitcher(false)}
              className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-sm px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="text-gray-900" style={{ fontWeight: 700 }}>Chọn tài khoản</p>
                  <button onClick={() => setShowSwitcher(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  {ACCOUNTS.map(acc => {
                    const isActive = currentUser.role === acc.role;
                    return (
                      <button
                        key={acc.role}
                        onClick={() => handleSwitchRole(acc.role)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition text-left ${
                          isActive
                            ? acc.color === 'orange'
                              ? 'border-orange-400 bg-orange-50'
                              : acc.color === 'blue'
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-purple-400 bg-purple-50'
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img src={acc.avatar} alt={acc.name} className="w-12 h-12 rounded-xl bg-gray-100" />
                          {isActive && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{acc.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              acc.color === 'orange' ? 'bg-orange-100 text-orange-600' : acc.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                            }`} style={{ fontWeight: 600 }}>{acc.badge}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">{acc.desc}</p>
                        </div>
                        {isActive && (
                          <div className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                            acc.color === 'orange' ? 'bg-orange-500 text-white' : acc.color === 'blue' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                          }`} style={{ fontWeight: 600 }}>Đang dùng</div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">Đây là demo — 2 tài khoản riêng biệt trên cùng thiết bị</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-sm border-b transition-colors duration-300 ${
        isWorker
          ? 'bg-gradient-to-r from-blue-700 to-indigo-700 border-blue-600'
          : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <SnapOnLogo size="md" dark={isWorker} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {[
              { path: '/', label: 'Trang chủ' },
              ...(isWorker ? [{ path: '/worker', label: '🔍 Tìm việc' }] : [{ path: '/post', label: '+ Đăng việc' }]),
              { path: '/activity', label: '📊 Hoạt động' },
              { path: '/profile', label: '👤 Hồ sơ' },
            ].map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? isWorker ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'
                      : isWorker ? 'text-blue-100 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ fontWeight: active ? 600 : 400 }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: on-job indicator + account */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* On-job badge (worker mode) */}
            {isWorker && workerStatus === 'on_job' && currentJob && (
              <Link to={`/job/${currentJob.id}`} className="hidden sm:flex items-center gap-1.5 bg-green-400/20 border border-green-400/40 text-green-200 text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Đang làm việc
              </Link>
            )}

            {/* Wallet badge */}
            {!isAdmin && (
              <button
                onClick={() => setShowWallet(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer hover:opacity-80 transition ${
                isWorker
                  ? 'bg-white/15 border border-white/20 text-white'
                  : 'bg-orange-50 border border-orange-200 text-orange-700'
              }`} style={{ fontWeight: 600 }}>
                <Wallet className="w-3.5 h-3.5" />
                <span>{formatWallet(walletBalance)}</span>
              </button>
            )}

            {/* Account switcher button */}
            <button
              onClick={() => setShowSwitcher(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition group ${
                isWorker
                  ? 'border-white/20 bg-white/10 hover:bg-white/20'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                  isWorker ? 'bg-green-400 border-blue-700' : 'bg-orange-400 border-gray-50'
                }`} />
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-xs leading-tight ${isWorker ? 'text-white' : 'text-gray-700'}`} style={{ fontWeight: 600 }}>
                  {currentUser.name.split(' ').slice(-1)[0]}
                </p>
                <p className={`text-xs leading-tight ${isWorker ? 'text-blue-200' : 'text-gray-400'}`}>
                  {isWorker ? '💼 Tìm việc' : '🏠 Thuê người'}
                </p>
              </div>
              <span className={`text-xs hidden sm:block ${isWorker ? 'text-blue-300' : 'text-gray-400'}`}>▾</span>
            </button>
          </div>
        </div>
      </header>

      {/* Worker on-job sticky banner */}
      {isWorker && workerStatus === 'on_job' && currentJob && (
        <div className="bg-green-600 text-white py-2.5 px-4 sticky top-16 z-40 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-sm" style={{ fontWeight: 600 }}>
                Đang nhận việc: <span className="text-green-200">{currentJob.title}</span>
              </span>
              <span className="text-green-300 text-sm hidden sm:inline">— {currentJob.hirerName}</span>
            </div>
            <Link
              to={`/job/${currentJob.id}`}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition flex-shrink-0"
              style={{ fontWeight: 600 }}
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      )}

      {/* Main content with page transitions */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Floating Action Button (mobile) ── */}
      <AnimatePresence>
        {!isWorker && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="md:hidden fixed bottom-[76px] right-4 z-40"
          >
            <Link
              to="/post"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white pl-4 pr-5 py-3 rounded-full shadow-xl shadow-orange-200 transition"
              style={{ fontWeight: 700 }}
            >
              <PlusCircle className="w-5 h-5" />
              Đăng việc
            </Link>
          </motion.div>
        )}
        {isWorker && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="md:hidden fixed bottom-[76px] right-4 z-40"
          >
            <Link
              to="/worker"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white pl-4 pr-5 py-3 rounded-full shadow-xl shadow-blue-200 transition"
              style={{ fontWeight: 700 }}
            >
              <Search className="w-5 h-5" />
              Tìm việc
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 safe-area-inset-bottom ${
        isWorker ? 'bg-blue-700 border-blue-600' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-around h-16">
          {[
            { path: '/', label: 'Trang chủ', icon: Home },
            isWorker
              ? { path: '/worker', label: 'Tìm việc', icon: Search }
              : { path: '/post', label: 'Đăng việc', icon: PlusCircle },
            { path: '/activity', label: 'Hoạt động', icon: Activity },
            { path: '/profile', label: 'Hồ sơ', icon: User },
          ].map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-all ${
                  isWorker
                    ? active ? 'text-white' : 'text-blue-300'
                    : active ? 'text-orange-500' : 'text-gray-400'
                }`}
              >
                {path === '/profile' ? (
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className={`w-6 h-6 rounded-full border-2 ${active
                        ? isWorker ? 'border-white' : 'border-orange-400'
                        : isWorker ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    />
                    {workerStatus === 'on_job' && isWorker && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-blue-700" />
                    )}
                  </div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-xs" style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Wallet Modal */}
      <WalletModal
        open={showWallet}
        onClose={() => setShowWallet(false)}
        balance={walletBalance}
        isWorker={isWorker}
        onTopUp={(amount) => topUpWallet(isWorker ? 'worker' : 'hirer', amount)}
      />

      {/* Footer */}
      <footer className="hidden md:block bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <SnapOnLogo size="sm" dark={true} />
          </div>
          <p className="text-sm">Nền tảng kết nối việc làm ngắn hạn — Nhanh · Gần · Tin cậy</p>
        </div>
      </footer>
    </div>
  );
}