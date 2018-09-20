let config = {
  localRun: process.env.LOCAL_RUN || false,
  lanesPerBatch: parseInt(process.env.LANES_PER_BATCH) || 10000,
  dbUser: process.env.DB_USER || 'system',
  dbPass: process.env.DB_PASS || 'oracle',
  connectString: process.env.CONNECT_STRING || 'oracle/xe'
};

export default config;
