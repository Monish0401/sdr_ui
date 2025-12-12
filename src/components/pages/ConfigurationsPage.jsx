import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TextConfigPage } from './TextConfigPage';
// import { DataConfigPage } from './DataConfigPage';
import { TestPage } from './TestPage';

export function ConfigurationsPage({ payloadData, setPayloadData, theme }) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={`mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Configurations</h1>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>Configure SDR payload using text-based commands or data packets</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="text" className="w-full">
          <TabsList className={theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-gray-100 border border-gray-200'}>

            <TabsTrigger
              value="text"
              // TEXT COLOR FIX: Add 'text-...' for inactive state, and 'data-[state=active]:text-...' for active state.
              className={theme === 'dark'
                ? 'text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-white'
                : 'text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900'}
            >
              Text Config
            </TabsTrigger>

            {/* <TabsTrigger
              value="data"
              className={theme === 'dark'
                ? 'text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-white'
                : 'text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900'}
            >
              Data Config
            </TabsTrigger> */}

            <TabsTrigger
              value="test"
              className={theme === 'dark'
                ? 'text-slate-300 data-[state=active]:bg-slate-800 data-[state=active]:text-white'
                : 'text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900'}
            >
              Data Config
            </TabsTrigger>

          </TabsList>

          <TabsContent value="text" className="mt-6">
            <TextConfigPage payloadData={payloadData} setPayloadData={setPayloadData} theme={theme} />
          </TabsContent>

          {/* <TabsContent value="data" className="mt-6">
            <DataConfigPage payloadData={payloadData} setPayloadData={setPayloadData} theme={theme} />
          </TabsContent> */}

          <TabsContent value="test" className="mt-6">
            <TestPage payloadData={payloadData} setPayloadData={setPayloadData} theme={theme} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}