import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'explore', label: 'Explore', path: '/' },
  { id: 'live', label: 'Live Weather', path: '/live' },
  { id: 'forecast', label: 'Forecast', path: '/forecast' },
];

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const getActiveTab = () => {
    if (currentPath === '/live') return 'live';
    if (currentPath === '/forecast') return 'forecast';
    return 'explore';
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[1050] h-16 bg-white/15 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <img src="/assets/logo.png" alt="SkyCast Logo" className="w-8 h-8 rounded-full object-cover shadow-soft" />
            <span className="text-heading-small font-medium text-charcoal tracking-tight">
              SkyCast
            </span>
          </button>

          {/* Tab Selector - Desktop */}
          <div className="hidden md:flex items-center h-10 bg-black/[0.04] rounded-full p-1 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="relative px-5 h-8 rounded-full text-caption transition-colors duration-200 cursor-pointer"
                style={{
                  color: activeTab === tab.id ? '#2C2824' : '#A09A93',
                }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cream rounded-full shadow-soft"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1050] h-16 bg-white/15 backdrop-blur-xl border-t border-white/20">
        <div className="flex items-center justify-around h-full px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1 cursor-pointer"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-cream/60 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-xs font-medium" style={{ color: activeTab === tab.id ? '#2C2824' : '#A09A93' }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
