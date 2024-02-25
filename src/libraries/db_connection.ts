import { createPool, Pool } from 'mysql2/promise'
import 'dotenv/config';

const CONECTION_INFORMATION = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}

export async function connect(): Promise<Pool> {
    const connection = await createPool(CONECTION_INFORMATION);
    return connection;
}