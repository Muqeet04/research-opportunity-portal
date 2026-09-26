const Opportunity = require('../models/opportunityModel');

const validateOpportunity = (data) => {
    const { title, research_area, faculty_name, department, application_deadline, available_positions, status } = data;
    
    if (!title || !research_area || !faculty_name || !department || !application_deadline) {
        return 'Missing required fields: title, research_area, faculty_name, department, application_deadline';
    }
    
    if (available_positions !== undefined && available_positions !== null) {
        if (!Number.isInteger(Number(available_positions)) || Number(available_positions) < 0) {
            return 'available_positions must be a non-negative integer';
        }
    }

    if (status && !['Open', 'Closed'].includes(status)) {
        return 'status must be Open or Closed';
    }
    
    return null;
};

const createOpportunity = async (req, res) => {
    try {
        const validationError = validateOpportunity(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        
        const id = await Opportunity.create({
            ...req.body,
            status: req.body.status || 'Open'
        });
        res.status(201).json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create opportunity' });
    }
};

const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.getAll();
        res.status(200).json(opportunities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch opportunities' });
    }
};

const getOpportunityById = async (req, res) => {
    try {
        const id = req.params.id;
        const opportunity = await Opportunity.getById(id);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.status(200).json(opportunity);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch opportunity' });
    }
};

const updateOpportunity = async (req, res) => {
    try {
        const id = req.params.id;
        
        const existing = await Opportunity.getById(id);
        if (!existing) {
             return res.status(404).json({ error: 'Opportunity not found' });
        }
        
        // Merge existing data with incoming partial body so partial updates work
        const merged = {
            title: req.body.title ?? existing.title,
            description: req.body.description ?? existing.description,
            research_area: req.body.research_area ?? existing.research_area,
            faculty_name: req.body.faculty_name ?? existing.faculty_name,
            department: req.body.department ?? existing.department,
            required_skills: req.body.required_skills ?? existing.required_skills,
            available_positions: req.body.available_positions ?? existing.available_positions,
            application_deadline: req.body.application_deadline ?? existing.application_deadline,
            status: req.body.status ?? existing.status
        };
        
        const validationError = validateOpportunity(merged);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        
        const affectedRows = await Opportunity.update(id, merged);
        
        if (affectedRows === 0) {
             return res.status(404).json({ error: 'Opportunity not found' });
        }
        
        const updated = await Opportunity.getById(id);
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update opportunity' });
    }
};

const deleteOpportunity = async (req, res) => {
    try {
        const id = req.params.id;
        const affectedRows = await Opportunity.deleteById(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.status(200).json({ message: 'Opportunity deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete opportunity' });
    }
};

module.exports = {
    createOpportunity,
    getAllOpportunities,
    getOpportunityById,
    updateOpportunity,
    deleteOpportunity
};
