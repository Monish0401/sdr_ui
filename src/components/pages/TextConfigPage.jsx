import { useState } from 'react';
import { Send, Terminal, Trash2, History, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
// TypeScript type imports removed: import type { PayloadData, Theme } from '../App';
import { toast } from 'sonner';

// TypeScript interface removed:
// interface TextConfigPageProps {
//   payloadData: PayloadData;
//   setPayloadData: (data: PayloadData) => void;
//   theme: Theme;
// }

export function TextConfigPage({ payloadData, setPayloadData, theme }) {
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Type annotation for useState removed: <Array<{ cmd: string; timestamp: string; status: 'success' | 'error' }>>
  const [commandHistory, setCommandHistory] = useState([
    { cmd: 'SET_FREQ 915.0', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success' },
    { cmd: 'SET_BW 125', timestamp: new Date(Date.now() - 240000).toISOString(), status: 'success' },
    { cmd: 'SET_GAIN 20', timestamp: new Date(Date.now() - 180000).toISOString(), status: 'success' },
  ]);

  const availableCommands = [
    { cmd: 'SET_FREQ <MHz>', desc: 'Set carrier frequency' },
    { cmd: 'SET_BW <kHz>', desc: 'Set bandwidth' },
    { cmd: 'SET_GAIN <dB>', desc: 'Set gain value' },
    { cmd: 'SET_SR <Sps>', desc: 'Set sample rate' },
    { cmd: 'SET_MOD <type>', desc: 'Set modulation (LoRa, FSK, GFSK)' },
    { cmd: 'START_TX', desc: 'Start transmission' },
    { cmd: 'STOP_TX', desc: 'Stop transmission' },
    { cmd: 'GET_STATUS', desc: 'Get current status' },
    { cmd: 'RESET', desc: 'Reset payload to defaults' },
  ];

  const handleSendCommand = async () => {
    if (!command.trim()) {
      toast.error('Please enter a command');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Parse and execute command
    const parts = command.trim().split(' ');
    const cmd = parts[0].toUpperCase();
    const value = parts[1];

    let newPayloadData = { ...payloadData };
    let success = true;

    try {
      switch (cmd) {
        case 'SET_FREQ':
          newPayloadData.frequency = parseFloat(value);
          break;
        case 'SET_BW':
          newPayloadData.bandwidth = parseInt(value);
          break;
        case 'SET_GAIN':
          newPayloadData.gain = parseInt(value);
          break;
        case 'SET_SR':
          newPayloadData.sampleRate = parseInt(value);
          break;
        case 'SET_MOD':
          newPayloadData.modulation = value;
          break;
        case 'START_TX':
          newPayloadData.status = 'active';
          break;
        case 'STOP_TX':
          newPayloadData.status = 'idle';
          break;
        case 'GET_STATUS':
          toast.info(`Status: ${payloadData.status}`);
          break;
        case 'RESET':
          newPayloadData = {
            ...newPayloadData,
            frequency: 915.0,
            bandwidth: 125,
            sampleRate: 250000,
            gain: 20,
            modulation: 'LoRa',
          };
          break;
        default:
          success = false;
          toast.error('Unknown command');
      }

      if (success) {
        newPayloadData.lastUpdate = new Date().toISOString();
        newPayloadData.textCommands = [...payloadData.textCommands, command.trim()];
        setPayloadData(newPayloadData);
        setCommandHistory([...commandHistory, { cmd: command.trim(), timestamp: new Date().toISOString(), status: 'success' }]);
        toast.success('Command executed successfully', {
          description: `${cmd} completed`,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-green-400" />
              <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Command Terminal</h2>
            </div>
            <div className="space-y-4">
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-300'}`}>
                <Textarea
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Enter command (e.g., SET_FREQ 915.0)"
                  className="bg-transparent border-0 text-green-400 font-mono resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendCommand();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendCommand} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      SendCommand
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setCommand('')} className={theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Command History</h2>
              </div>
              <Button variant="outline" size="sm" onClick={clearHistory} className={theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}>
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

        <div className="space-y-6">
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
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
          </Card>

          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <h2 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
            <div className="space-y-2">
              <Button
                onClick={() => setCommand('START_TX')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Transmission
              </Button>
              <Button
                onClick={() => setCommand('STOP_TX')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Stop Transmission
              </Button>
              <Button
                onClick={() => setCommand('GET_STATUS')}
                variant="outline"
                className={`w-full ${theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}`}
              >
                Get Status
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}