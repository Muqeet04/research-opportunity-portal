const db = require('../config/db');

const Opportunity = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM research_opportunities ORDER BY created_at DESC');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM research_opportunities WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status } = data;
        const [result] = await db.query(
            `INSERT INTO research_opportunities 
            (title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status } = data;
        const [result] = await db.query(
            `UPDATE research_opportunities SET 
            title = ?, description = ?, research_area = ?, faculty_name = ?, department = ?, required_skills = ?, available_positions = ?, application_deadline = ?, status = ? 
            WHERE id = ?`,
            [title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status, id]
        );
        return result.affectedRows;
    },
    deleteById: async (id) => {
        const [result] = await db.query('DELETE FROM research_opportunities WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Opportunity;
