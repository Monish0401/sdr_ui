import { useState, useRef } from 'react';
import { Send, Terminal, Trash2, History, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
//HomePage Lib
import {
  Activity,
  Signal,
  Gauge,
  Radio,
  Clock,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};




export function TestPage({ payloadData, setPayloadData, theme }) {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState({
    Start: false,
    Stop: false,
    Status: false
  });
  // Type annotation for useState removed: <Array<{ cmd: string; timestamp: string; status: 'success' | 'error' }>>
  const [commandHistory, setCommandHistory] = useState([
    { cmd: 'SET_FREQ 915.0', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success' },
    { cmd: 'SET_BW 125', timestamp: new Date(Date.now() - 240000).toISOString(), status: 'success' },
    { cmd: 'SET_GAIN 20', timestamp: new Date(Date.now() - 180000).toISOString(), status: 'success' },
  ]);



  const handleQuickActions = async (buttonType) => {

    // setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));



    let newPayloadData = { ...payloadData };
    let success = true;




    try {
      switch (buttonType) {
        case 'Start':
          setIsLoading((prevState) => ({
            ...prevState,
            [buttonType]: true,
          }));
          
          setTimeout(() => {
            setIsLoading((prevState) => ({
              ...prevState,
              [buttonType]: false,
            }));
            newPayloadData.status = 'active';
          }, 2000);
          break;
        case 'Stop':
          newPayloadData.status = 'idle';
          break;
        case 'Status':
          success = false;
          toast.info(`Status: ${payloadData.status}`);
          break;
        default:
          success = false;
          toast.error('Unknown Button Type');
      }

      if (success) {
        newPayloadData.lastUpdate = new Date().toISOString();
        newPayloadData.textCommands = [...payloadData.textCommands, command.trim()];
        setPayloadData(newPayloadData);
        setCommandHistory([...commandHistory, { cmd: buttonType, timestamp: new Date().toISOString(), status: 'success' }]);
        toast.success('Command executed successfully', {
          description: `${buttonType} completed`,
        });
        setCommand('');
      }
    } catch (error) {
      toast.error('Invalid command parameters');
      setCommandHistory([...commandHistory, { cmd: command.trim(), timestamp: new Date().toISOString(), status: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setCommandHistory([]);
    toast.info('Command history cleared');
  };

  //Home Page Functions
  const statusColor = {
    active: "bg-green-500",
    idle: "bg-yellow-500",
    error: "bg-red-500",
  }[payloadData.status];

  const statusText = {
    active: "Active",
    idle: "Idle",
    error: "Error",
  }[payloadData.status];

  const metrics = [
    {
      label: "Frequency",
      value: `${payloadData.frequency} MHz`,
      icon: Signal,
      color: "text-blue-400",
    },
    {
      label: "Bandwidth",
      value: `${payloadData.bandwidth} kHz`,
      icon: Activity,
      color: "text-purple-400",
    },
    {
      label: "Sample Rate",
      value: `${(payloadData.sampleRate / 1000).toFixed(0)} kSps`,
      icon: Gauge,
      color: "text-cyan-400",
    },
    {
      label: "Gain",
      value: `${payloadData.gain} dB`,
      icon: Radio,
      color: "text-green-400",
    },
  ];



  return (
    <div className="space-y-6">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      {metric.label}
                    </p>
                    <motion.p
                      className={`${metric.color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {metric.value}
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Icon
                      className={`w-8 h-8 ${metric.color} opacity-50`}
                    />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-blue-400" />
              <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Data Configuration
              </h2>
            </div>
            <div className="space-y-3">
              <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Modulation</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {payloadData.modulation}
                </span>
              </div>
              <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Frequency</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {payloadData.frequency} MHz
                </span>
              </div>
              <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Bandwidth</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {payloadData.bandwidth} kHz
                </span>
              </div>
              <div className={`flex justify-between items-center py-2 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                  Sample Rate
                </span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {payloadData.sampleRate} Sps
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Gain</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {payloadData.gain} dB
                </span>
              </div>
            </div>
          </Card>



        </div>

        <div className="space-y-6">
          {/* <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Available Commands</h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {availableCommands.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => setCommand(item.cmd)}
                  >
                    <code className="text-blue-400 block mb-1">{item.cmd}</code>
                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card> */}

          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
            <div className="space-y-2">
              <Button
                onClick={() => handleQuickActions('Start')}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading.Start}
              >
                {isLoading.Start ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    Start Transmission
                  </>
                )}

              </Button>
              <Button
                onClick={() => handleQuickActions('Stop')}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    Stop Transmission
                  </>
                )}

              </Button>
              <Button
                onClick={() => handleQuickActions('Status')}
                variant="outline"
                className={`w-full ${theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}`}
              >
                Get Status
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Data History</h2>
          </div>
          <Button variant="outline" size="sm" onClick={clearHistory} className={theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {commandHistory.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-8 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}
                >
                  No commands executed yet
                </motion.p>
              ) : (
                commandHistory.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}
                  >
                    <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className="shrink-0">
                      {item.status}
                    </Badge>
                    <code className="text-green-400 flex-1 font-mono">{item.cmd}</code>
                    <span className={`shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </ScrollArea>
      </Card>
    </div>

  );
}