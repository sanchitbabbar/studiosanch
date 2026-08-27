CREATE TABLE client_accounts (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 username VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 email VARCHAR(254) NOT NULL,
 booking_reference VARCHAR(128) NOT NULL,
 password_hash VARCHAR(255) NULL,
 status ENUM('invited','active','disabled') NOT NULL DEFAULT 'invited',
 session_version INT UNSIGNED NOT NULL DEFAULT 1,
 invitation_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NULL UNIQUE,
 invitation_expires DATETIME NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE client_auth_limits (
 bucket CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
 attempts INT UNSIGNED NOT NULL,
 expires_at BIGINT UNSIGNED NOT NULL,
 INDEX (expires_at)
) ENGINE=InnoDB;
