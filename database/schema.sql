CREATE DATABASE IF NOT EXISTS research_portal;
USE research_portal;

CREATE TABLE IF NOT EXISTS research_opportunities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    research_area VARCHAR(255) NOT NULL,
    faculty_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    required_skills VARCHAR(500),
    available_positions INT,
    application_deadline DATE NOT NULL,
    status ENUM('Open', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
