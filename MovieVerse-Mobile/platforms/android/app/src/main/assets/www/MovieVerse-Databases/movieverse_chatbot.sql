-- Create 'chatbot_sessions' table
CREATE TABLE chatbot_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create 'chatbot_messages' table
CREATE TABLE chatbot_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    message TEXT NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chatbot_sessions(session_id)
);

-- Create 'chatbot_logs' table for logging purposes
CREATE TABLE chatbot_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    log_message TEXT NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chatbot_sessions(session_id)
);

-- Indexes for optimizing queries
CREATE INDEX idx_session_user ON chatbot_sessions (user_id);
CREATE INDEX idx_messages_session ON chatbot_messages (session_id);
