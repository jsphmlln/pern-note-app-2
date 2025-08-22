//imported modules
const express = require('express');
const cors = require('cors');
const { pool } = require('pg');
require ('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//==API Routes==//

//root route
app.get ('/', (req, res) => {
  res.send('Welcome to the PERN App Backend!');
});

//add notes route
app.post ('/notes', async (req, res) => {
  try {
    const { description } = req.body;
    const newNote = await pool.query(
      "INSERT INTO notes (description) VALUES($1) RETURNING *",
      [description]
    );
    res.status(201).json(newNote.rows[0]);
  }catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//get all notes route
app.get ('/notes', async (req, res) => {
  try {
    const allNotes = await pool.query(
      "SELECT * FROM notes ORDER BY note_id ASC"
    )
    res.status(200).json(allNotes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//update note route
app.put ('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateNote = await pool.query(
      "UPDATE notes SET description = $1 WHERE note_id = $2 RETURNING *",
      [description, id]
    );
    if (updateNote.rows.length == 0) {
      return res.status(404).json("Note not found or no changes made.");
    }
    res.status(200).json(updateNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.delete ('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNote = await pool.query(
      "DELETE FROM notes WHERE note_id = $1 RETURNING *",
      [id]
    );
    if (deleteNote.rows.length == 0) {
      return res.status(404).json("Note not found.");
    }
    res.status(200).json("Note was deleted successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`Access backend at: http://localhost:${PORT}`);
});