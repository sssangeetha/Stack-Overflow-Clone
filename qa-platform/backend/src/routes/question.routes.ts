import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// GET all questions
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        q.*,
        u.username,
        u.email
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC 
      LIMIT 20
    `);
    
    res.json({ 
      success: true,
      questions: result.rows, 
      total: result.rowCount 
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    next(error);
  }
});

// GET question by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        q.*,
        u.username,
        u.email
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Question not found' 
      });
    }
    
    res.json({ 
      success: true,
      question: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    next(error);
  }
});

// POST new question
router.post('/', async (req, res, next) => {
  try {
    const { title, body, tags, userId } = req.body;
    
    console.log('Received question data:', { title, body, tags, userId });
    
    // Validation
    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and body are required' 
      });
    }
    
    // Convert tags string to array if needed
    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    
    // Use a default user ID if not provided (for testing)
    const finalUserId = userId || '00000000-0000-0000-0000-000000000001';
    
    const result = await pool.query(
      `INSERT INTO questions (title, body, tags, user_id, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [title, body, tagsArray, finalUserId]
    );
    
    console.log('Question created:', result.rows[0]);
    
    res.status(201).json({ 
      success: true,
      question: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating question:', error);
    next(error);
  }
});

export default router;