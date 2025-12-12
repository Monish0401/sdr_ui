import { useState } from 'react';
import { Trash2, History, Loader2, Download, Plus, Activity, Signal, Gauge, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
// import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
// import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
//DataConfigPage Lib
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  // Type annotation for useState removed: <Array<{ cmd: string; timestamp: string; status: 'success' | 'error' }>>
  const [commandHistory, setCommandHistory] = useState([
    { cmd: 'SET_FREQ 915.0', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success' },
    { cmd: 'SET_BW 125', timestamp: new Date(Date.now() - 240000).toISOString(), status: 'success' },
    { cmd: 'SET_GAIN 20', timestamp: new Date(Date.now() - 180000).toISOString(), status: 'success' },
  ]);



  const handleQuickActions = async (buttonType) => {






    let newPayloadData = { ...payloadData };
    let success = true;




    try {
      switch (buttonType) {
        case 'Start':
          setIsLoading(true);
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          newPayloadData.status = 'active';
          break;
        case 'Stop':
          setIsLoading1(true);
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          newPayloadData.status = 'idle';
          break;
        case 'Status':
          setIsLoading2(true);
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          toast.info(`Status: ${payloadData.status}`);
          break;
        case 'Update':
          newPayloadData = {
            ...newPayloadData,
            frequency: newPacket.id,
            bandwidth: newPacket.size,
            sampleRate: newPacket.data,
            gain: newPacket.gain,
            modulation: newPacket.type,
          };
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
        await new Promise(resolve => setTimeout(resolve, 3000));
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
      setIsLoading1(false);
      setIsLoading2(false);
    }
  };

  const clearHistory = () => {
    setCommandHistory([]);
    toast.info('Command history cleared');
  };

  //Home Page Functions


  // const statusColor = {
  //   active: "bg-green-500",
  //   idle: "bg-yellow-500",
  //   error: "bg-red-500",
  // }[payloadData.status];

  // const statusText = {
  //   active: "Active",
  //   idle: "Idle",
  //   error: "Error",
  // }[payloadData.status];

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

  //DataConfigPage Functions


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Removed: <string | null> type annotation
  const [isDeleting, setIsDeleting] = useState(null);
  const [newPacket, setNewPacket] = useState({
    id: '',
    type: '',
    size: '',
    data: '',
    gain: ''
  });

  const handleAddPacket = () => {
    if (!newPacket.data || !newPacket.data) {
      toast.error('Please fill in all fields');
      return;
    }

    const packet = {
      ...newPacket,
      timestamp: new Date().toISOString()
    };

    setPayloadData({
      ...payloadData,
      dataPackets: [packet, ...payloadData.dataPackets],
      lastUpdate: new Date().toISOString()
    });

    setNewPacket({
      id: '',
      type: '',
      size: '',
      data: '',
      gain: ''
    });

    handleQuickActions('Update');
    setIsDialogOpen(false);
    toast.success('Data added successfully');
  };

  // Removed: (id: string) type annotation
  const handleDeletePacket = async (id) => {
    setIsDeleting(id);
    await new Promise(resolve => setTimeout(resolve, 500));

    setPayloadData({
      ...payloadData,
      dataPackets: payloadData.dataPackets.filter(p => p.id !== id)
    });
    toast.success('Data packet deleted', {
      description: `Packet ${id} has been removed`,
    });
    setIsDeleting(null);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(payloadData.dataPackets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sdr-payload-data-${Date.now()}.json`;
    link.click();
    toast.success('Data exported successfully');
  };

  // // Removed: React.ChangeEvent<HTMLInputElement> type annotation
  // const handleImportData = (event) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const data = JSON.parse(e.target?.result); // Removed 'as string' type assertion
  //       setPayloadData({
  //         ...payloadData,
  //         dataPackets: [...data, ...payloadData.dataPackets]
  //       });
  //       toast.success('Data imported successfully');
  //     } catch (error) {
  //       toast.error('Invalid JSON file');
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  // const totalDataSize = payloadData.dataPackets.reduce((sum, p) => sum + p.size, 0);



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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-400" />
                <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Data Configuration
                </h2>
              </div>
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'}>
                    <DialogHeader>
                      <DialogTitle>Add New Data</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="packet-id" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Frequency (MHz)</Label>
                        <Input
                          id="packet-id"
                          value={newPacket.id}
                          onChange={(e) => setNewPacket({ ...newPacket, id: e.target.value })}
                          placeholder="915"
                          className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="packet-type" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Modulation</Label>
                        <Select
                          value={newPacket.type}
                          onValueChange={(value) => setNewPacket({ ...newPacket, type: value })}
                        >
                          <SelectTrigger className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                            <SelectItem value="LoRa">LoRa-(Chirp Spread Spectrum)</SelectItem>
                            <SelectItem value="FSK">FSK-(Frequency Shift Keying)</SelectItem>
                            <SelectItem value="GFSK">GFSK-(Gaussian Frequency Shift Keying)</SelectItem>
                            <SelectItem value="ASK">ASK-(Amplitude Shift Keying)</SelectItem>
                            <SelectItem value="PSK">PSK-(Phase Shift Keying)</SelectItem>
                            <SelectItem value="QAM">QAM-(Quadrature Amplitude Modulation)</SelectItem>
                            <SelectItem value="OFDM">OFDM-(Orthogonal Frequemcy Division Multiplexing)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="packet-size" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Bandwidth (kHz)</Label>
                        <Input
                          id="packet-size"
                          type="number"
                          value={newPacket.size}
                          onChange={(e) => setNewPacket({ ...newPacket, size: parseInt(e.target.value) })}
                          placeholder="125"
                          className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="packet-data" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Sample Rate (Sps)</Label>
                        <Input
                          id="packet-data"
                          value={newPacket.data}
                          onChange={(e) => setNewPacket({ ...newPacket, data: e.target.value })}
                          placeholder="250000"
                          className={`mt-2 font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gain" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Gain (dB)</Label>
                        <Input
                          id="gain"
                          type="number"
                          value={newPacket.gain}
                          onChange={(e) => setNewPacket({ ...newPacket, gain: parseInt(e.target.value) })}
                          placeholder="20"
                          className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <Button onClick={handleAddPacket} className="w-full bg-blue-600 hover:bg-blue-700">
                        Add Packet
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                disabled={isLoading}
              >
                {isLoading ? (
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
                disabled={isLoading1}
              >
                {isLoading1 ? (
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
                disabled={isLoading2}
              >
                {isLoading2 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    Get Status
                  </>
                )}

              </Button>
            </div>
          </Card>
        </div>
      </div>
      {/* <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
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
      </Card> */}
      <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Data History</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData} className={theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {/* <Button variant="outline" className={`relative ${theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}`}>
              <Upload className="w-4 h-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button> */}
            <Button variant="outline" onClick={handleDeletePacket} className={theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
          <Table>
            <TableHeader>
              <TableRow className={theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Frequency</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Modulation</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Bandwidth</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Sample Rate</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Gain</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {payloadData.dataPackets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className={`text-center py-8 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                      No data available. Add your first data to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  payloadData.dataPackets.map((packet, idx) => (
                    <motion.tr
                      key={packet.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: idx * 0.05 }}
                      className={theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}
                    >
                      <TableCell className="text-blue-400 font-mono">{packet.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}>
                          {packet.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>{packet.size} bytes</TableCell>
                      <TableCell className="text-cyan-400 font-mono">{packet.data}</TableCell>
                      <TableCell className="text-cyan-400 font-mono">{packet.gain}</TableCell>
                      <TableCell className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                        {new Date(packet.timestamp).toLocaleString()}
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={theme === 'dark' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePacket(packet.id)}
                            disabled={isDeleting === packet.id}
                            className={`text-red-400 ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100'}`}
                          >
                            {isDeleting === packet.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell> */}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>

  );
}