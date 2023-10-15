const express = require('express');
const { body } = require('express-validator');
const { addNote, fetchNotes, updateNote, deleteNote } = require('../controllers/notesController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');

const router = express.Router();

const createNotesrValidationRules = [
  body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
]

const ayncHandler = require('../common/asyncHandler');

//Route 1: Add notes of a user (login required) Using POST: api/v1/notes/add-note
router.post('/add-note', authenticateUser, createNotesrValidationRules, ayncHandler(addNote));

//Route 2: Fetch notes of a user (login required) Using POST: api/v1/notes/get-notes
router.get('/get-notes', authenticateUser, ayncHandler(fetchNotes));

//Route 3: Update note of a user (login required) Using PUT: api/v1/notes/update-note
router.put('/update-note/:id', authenticateUser, ayncHandler(updateNote));

//Route 4: Delete note of a user (login required) Using DELETE: api/v1/notes/delete-note
router.delete('/delete-note/:id', authenticateUser, ayncHandler(deleteNote));

module.exports = router;