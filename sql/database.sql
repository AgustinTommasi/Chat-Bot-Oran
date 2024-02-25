CREATE TABLE `conversations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `number` BIGINT NOT NULL,
  `start_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `archived` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;


CREATE TABLE `chats` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversation_id` INT NOT NULL,
  `role` VARCHAR(40) NOT NULL,
  `content` TEXT NOT NULL,
  `code` TEXT NULL,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;


DELIMITER $$

CREATE PROCEDURE InsertConversationAndChat(IN conv_number BIGINT, IN chat_role VARCHAR(40), IN chat_content TEXT, IN chat_code VARCHAR(40))
BEGIN
    DECLARE new_conversation_id INT;
    DECLARE existing_conversation_id INT;

    -- Intenta obtener el máximo conversation_id existente que cumpla con la condición.
    SELECT MAX(id) INTO existing_conversation_id FROM conversations WHERE number = conv_number AND archived = false;

    -- Verifica si se encontró algún ID.
    IF existing_conversation_id IS NULL THEN
        -- Si no se encontró, inserta una nueva entrada en conversations.
        INSERT INTO conversations (number) VALUES (conv_number);
        -- Obtiene el ID de la nueva entrada insertada.
        SET new_conversation_id = LAST_INSERT_ID();
    ELSE
        -- Si se encontró una conversación existente, usa ese ID.
        SET new_conversation_id = existing_conversation_id;
    END IF;

    -- Inserta una nueva entrada en chats con el conversation_id obtenido.
    INSERT INTO chats (conversation_id, role, content, code) VALUES (new_conversation_id, chat_role, chat_content, chat_code);
END$$
