import {
  Activity,
  Signal,
  Gauge,
  Radio,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

// Removed TypeScript type imports

// Removed interface HomePageProps

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

export function HomePage({ payloadData, theme }) { // Converted function signature
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
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className={`mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            SDR Payload Status
          </h1>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
            Real-time monitoring and payload information
          </p>
        </div>
        <motion.div 
          className="flex items-center gap-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Badge
            variant="outline"
            className={`${statusColor} border-0 text-white`}
          >
            <motion.div
              className={`w-2 h-2 rounded-full bg-white mr-2`}
              animate={payloadData.status === "active" ? {
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {statusText}
          </Badge>
        </motion.div>
      </motion.div>

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

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-blue-400" />
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Current Configuration
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

        <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Recent Activity</h2>
          </div>
          <div className="space-y-3">
            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400">
                  Last Command
                </span>
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}>
                  {new Date(
                    payloadData.lastUpdate,
                  ).toLocaleTimeString()}
                </span>
              </div>
              <code className="text-green-400">
                {
                  payloadData.textCommands[
                    payloadData.textCommands.length - 1
                  ]
                }
              </code>
            </div>
            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-400">
                  Last Data Packet
                </span>
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}>
                  {new Date(
                    payloadData.dataPackets[0]?.timestamp ||
                      Date.now(),
                  ).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-cyan-400">
                  {payloadData.dataPackets[0]?.id}
                </code>
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                  {payloadData.dataPackets[0]?.size} bytes
                </span>
              </div>
            </div>
            <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                  System Status
                </span>
                <span className="text-green-400">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Command History</h2>
          <motion.div 
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {payloadData.textCommands.map((cmd, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
              >
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}>#{idx + 1}</span>
                <code className="text-green-400 flex-1">
                  {cmd}
                </code>
                <span className={theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}>Executed</span>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
