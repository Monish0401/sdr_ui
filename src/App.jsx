import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomePage } from './components/HomePage';
import { ConfigurationsPage } from './components/ConfigurationsPage';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/sonner';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [payloadData, setPayloadData] = useState({
    frequency: 915.0,
    bandwidth: 125,
    sampleRate: 250000,
    gain: 20,
    modulation: 'LoRa',
    status: 'active',
    lastUpdate: new Date().toISOString(),
    textCommands: [
      'SET_FREQ 915.0',
      'SET_BW 125',
      'SET_GAIN 20',
      'START_TX'
    ],
    dataPackets: [
      {
        id: 'PKT001',
        timestamp: new Date().toISOString(),
        size: 256,
        type: 'Telemetry',
        data: '0x4A5F2E...'
      },
      {
        id: 'PKT002',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        size: 128,
        type: 'Command',
        data: '0x1B3C4D...'
      }
    ]
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage payloadData={payloadData} theme={theme} />;
      case 'config':
        return <ConfigurationsPage payloadData={payloadData} setPayloadData={setPayloadData} theme={theme} />;
      default:
        return <HomePage payloadData={payloadData} theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
      <Header />
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster theme={theme} />
      <Footer />
    </div>
  );
}

export default App;