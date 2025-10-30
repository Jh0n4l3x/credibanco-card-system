-- --------------------------------------------------
-- DATABASE CREATION
-- --------------------------------------------------
CREATE DATABASE IF NOT EXISTS credibanco_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE credibanco_db;

-- --------------------------------------------------
-- TABLE: card
-- --------------------------------------------------
CREATE TABLE card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL UNIQUE,
    pan VARCHAR(25) NOT NULL,
    holder_name VARCHAR(100) NOT NULL,
    document_number VARCHAR(20) NOT NULL,
    card_type ENUM('CREDITO', 'DEBITO') NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    status ENUM('CREADA', 'ENROLADA', 'INACTIVA') DEFAULT 'CREADA',
    validation_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------
-- TABLE: transaction
-- --------------------------------------------------
CREATE TABLE transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT NOT NULL,
    reference_number VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    purchase_address VARCHAR(255) NOT NULL,
    status ENUM('APROBADA', 'RECHAZADA', 'ANULADA') DEFAULT 'APROBADA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES card(id)
);

-- --------------------------------------------------
-- TABLE: audit_log
-- --------------------------------------------------
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_identifier VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
