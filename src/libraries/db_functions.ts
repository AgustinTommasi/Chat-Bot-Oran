import { RowDataPacket } from "mysql2";
import { Conversation } from "../interfaces/conversation";
import { connect } from "./db_connection";

export async function loadConversation(user: string) {
  const conn = await connect();
  const sql =
    "SELECT * FROM conversations INNER JOIN chats ON conversations.id = chats.conversation_id WHERE archived = FALSE AND number = ?";
  const [conversation] = await conn.query(sql, user);
  return conversation as RowDataPacket[] as Conversation[];
}

export async function archiveConversation(user: string) {
  const conn = await connect();
  const sql = "UPDATE `conversations` SET `archived` = 1 WHERE `number` = ?";
  await conn.query(sql, user);
}

export async function addChat(
  number: string,
  role: string,
  content: string,
  code: string = "",
  messageId: string = "",
  ack: number = 0
) {
  const conn = await connect();
  const sql = "CALL InsertConversationAndChat(?, ?, ?, ?, ?, ?)";
  const values = [
    parseInt(number),
    role.toString(),
    content.toString(),
    code.toString(),
    messageId.toString(),
    ack,
  ];
  await conn.execute(sql, values);
}

export async function archiveAll() {
  const conn = await connect();
  const sql = "UPDATE `conversations` SET `archived` = 1";
  await conn.query(sql);
}

export async function changeAck(id: string, ack: number) {
  const conn = await connect();
  const sql = "UPDATE `chats` SET `message_ack` = ? WHERE `message_id` = ?";
  const values = [ack, id];
  await conn.query(sql, values);
}

export async function getMessageAcks(
  messageIds: string[]
): Promise<{ [key: string]: number }> {
  const conn = await connect();

  // Si el array está vacío, retornar objeto vacío
  if (!messageIds.length) return {};

  // Preparar la consulta con IN clause
  const placeholders = messageIds.map(() => "?").join(",");
  const sql = `
      SELECT message_id, message_ack 
      FROM chats 
      WHERE message_id IN (${placeholders})
    `;

  const [results] = await conn.query(sql, messageIds);

  // Convertir los resultados a un objeto {message_id: message_ack}
  const acks = (results as RowDataPacket[]).reduce(
    (acc: { [key: string]: number }, row) => {
      acc[row.message_id] = row.message_ack;
      return acc;
    },
    {}
  );

  return acks;
}
