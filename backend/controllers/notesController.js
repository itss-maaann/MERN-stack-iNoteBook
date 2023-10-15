const Note = require('../models/Note');
const { validationResult } = require('express-validator');

const addNote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, error: errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const existingTitle = await Note.findOne({ title });
        if (existingTitle) {
            return res.status(400).json({ status: false, error: 'Title is already taken' });
        }

        const userId = req.user.id;

        const createNote = new Note({ title, description, tag, user: userId });

        const note = await createNote.save();

        return res.status(201).json({ status: true, note });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
}

const fetchNotes = async (req, res) => {
    try {
        const user = req.user.id;
        const notes = await Note.find({ user });
        if (notes.length < 1) {
            return res.status(404).json({ status: false, message: 'You do not have any notes' });
        }

        return res.status(200).json({ status: true, notes });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
}

const updateNote = async (req, res) => {
    const { title, description, tag } = req.body;

    if (!title && !description && !tag) {
        return res.status(400).json({ status: false, error: 'At least one field (title, description, tag) must be provided for update' });
    }

    try {

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ status: false, error: 'Note not Found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ status: false, error: 'You do not have permission to update this note' });
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

        return res.status(200).json({ status: true, note });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
}

const deleteNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ status: false, error: 'Note not Found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ status: false, error: 'You do not have permission to delete this note' });
        }

        note = await Note.findByIdAndDelete(req.params.id);

        return res.status(200).json({ status: true, note });
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
}

module.exports = { addNote, fetchNotes, updateNote, deleteNote }