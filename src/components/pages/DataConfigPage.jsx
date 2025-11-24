import { useState } from 'react';
import { Database, Upload, Download, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// Assuming these UI components (Card, Button, Input, etc.) are imported correctly from a library
// or local files and are functional components.
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

// Removed: interface DataConfigPageProps { ... }
// Removed: type { PayloadData, Theme } from '../App';

export function DataConfigPage({ payloadData, setPayloadData, theme }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Removed: <string | null> type annotation
  const [isDeleting, setIsDeleting] = useState(null);
  const [newPacket, setNewPacket] = useState({
    id: '',
    type: 'Telemetry',
    size: 256,
    data: ''
  });

  const handleAddPacket = () => {
    if (!newPacket.id || !newPacket.data) {
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
      type: 'Telemetry',
      size: 256,
      data: ''
    });
    setIsDialogOpen(false);
    toast.success('Data packet added successfully');
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

  // Removed: React.ChangeEvent<HTMLInputElement> type annotation
  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result); // Removed 'as string' type assertion
        setPayloadData({
          ...payloadData,
          dataPackets: [...data, ...payloadData.dataPackets]
        });
        toast.success('Data imported successfully');
      } catch (error) {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const totalDataSize = payloadData.dataPackets.reduce((sum, p) => sum + p.size, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-600 border-0 text-white">
            {payloadData.dataPackets.length} Packets
          </Badge>
          <Badge variant="outline" className="bg-purple-600 border-0 text-white">
            {(totalDataSize / 1024).toFixed(2)} KB Total
          </Badge>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          { label: 'Total Packets', value: payloadData.dataPackets.length, color: 'text-blue-400' },
          { label: 'Total Size', value: `${totalDataSize} bytes`, color: 'text-purple-400' },
          { label: 'Last Update', value: new Date(payloadData.lastUpdate).toLocaleTimeString(), color: 'text-cyan-400' },
          { label: 'Avg Size', value: `${payloadData.dataPackets.length > 0 ? (totalDataSize / payloadData.dataPackets.length).toFixed(0) : 0} bytes`, color: 'text-green-400' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <p className={`mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</p>
              <motion.p 
                className={stat.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.2, type: "spring" }}
              >
                {stat.value}
              </motion.p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Data Packets</h2>
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
                    <Label htmlFor="packet-id" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Packet ID</Label>
                    <Input
                      id="packet-id"
                      value={newPacket.id}
                      onChange={(e) => setNewPacket({ ...newPacket, id: e.target.value })}
                      placeholder="PKT003"
                      className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packet-type" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Type</Label>
                    <Select
                      value={newPacket.type}
                      onValueChange={(value) => setNewPacket({ ...newPacket, type: value })}
                    >
                      <SelectTrigger className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}>
                        <SelectItem value="Telemetry">Telemetry</SelectItem>
                        <SelectItem value="Command">Command</SelectItem>
                        <SelectItem value="Status">Status</SelectItem>
                        <SelectItem value="Beacon">Beacon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="packet-size" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Size (bytes)</Label>
                    <Input
                      id="packet-size"
                      type="number"
                      value={newPacket.size}
                      onChange={(e) => setNewPacket({ ...newPacket, size: parseInt(e.target.value) })}
                      className={`mt-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packet-data" className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Data (Hex)</Label>
                    <Input
                      id="packet-data"
                      value={newPacket.data}
                      onChange={(e) => setNewPacket({ ...newPacket, data: e.target.value })}
                      placeholder="0x4A5F2E..."
                      className={`mt-2 font-mono ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <Button onClick={handleAddPacket} className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Packet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExportData} className={theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className={`relative ${theme === 'dark' ? 'border-gray-300 text-gray-700' : 'border-gray-300 text-gray-700'}`}>
              <Upload className="w-4 h-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>

        <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
          <Table>
            <TableHeader>
              <TableRow className={theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Packet ID</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Type</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Size</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Data</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Timestamp</TableHead>
                <TableHead className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {payloadData.dataPackets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className={`text-center py-8 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                      No data packets available. Add your first packet to get started.
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
                      <TableCell className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                        {new Date(packet.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
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