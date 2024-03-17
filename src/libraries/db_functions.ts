import { RowDataPacket } from 'mysql2';
import { Conversation } from '../interfaces/conversation';
import { connect } from './db_connection'

export async function loadConversation(user: string) {
    const conn = await connect();
    const sql = 'SELECT * FROM conversations INNER JOIN chats ON conversations.id = chats.conversation_id WHERE archived = FALSE AND number = ?'
    const [conversation] = await conn.query(sql, user);
    return conversation as RowDataPacket[] as Conversation[];
}

export async function archiveConversation(user: string) {
    const conn = await connect();
    const sql = 'UPDATE `conversations` SET `archived` = 1 WHERE `number` = ?';
    await conn.query(sql, user);
}

export async function addChat(number: string, role: string, content: string, code: string = "") {
    const conn = await connect();
    const sql = 'CALL InsertConversationAndChat(?, ?, ?, ?)';
    const values = [number, role, content, code];
    await conn.execute(sql, values);
}

export async function archiveAll() {
    const conn = await connect();
    const sql = 'UPDATE `conversations` SET `archived` = 1';
    await conn.query(sql);
}
