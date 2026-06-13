import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Explore from '@/pages/Explore';
import LiveWeather from '@/pages/LiveWeather';
import Forecast from '@/pages/Forecast';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <NavigationBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Explore />
              </AnimatedPage>
            }
          />
          <Route
            path="/live"
            element={
              <AnimatedPage>
                <LiveWeather />
              </AnimatedPage>
            }
          />
          <Route
            path="/forecast"
            element={
              <AnimatedPage>
                <Forecast />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
