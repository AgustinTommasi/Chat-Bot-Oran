import fs from 'fs';
import util from 'util';
import { client } from './libraries/whatsapp_client';
import { archiveAll } from './libraries/db_functions';

const logFile = fs.createWriteStream(__dirname + '/debug.log', { flags: 'a' });
const logStdout = process.stdout;

console.log = (d: any) => {
    logFile.write(util.format(d) + '\n');
    logStdout.write(util.format(d) + '\n');
};
archiveAll()
console.log('STARTING...');
client.initialize();
