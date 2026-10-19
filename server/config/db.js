import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecitizen_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

let pool = null;
let isConnected = false;

export async function getDbPool() {
  if (pool) return pool;

  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    isConnected = true;
    console.log(`[MySQL] Successfully connected to database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return pool;
  } catch (err) {
    isConnected = false;
    console.warn(`[MySQL Notice] Could not connect to MySQL server (${err.message}).`);
    console.warn(`[MySQL Notice] Verify that MySQL service is running or check server/.env settings.`);
    return null;
  }
}

export function isDbConnected() {
  return isConnected;
}

export async function executeQuery(sql, params = []) {
  const currentPool = await getDbPool();
  if (!currentPool) {
    throw new Error('Database connection is not available');
  }
  const [rows] = await currentPool.execute(sql, params);
  return rows;
}

export default { getDbPool, isDbConnected, executeQuery };
