//imported modules
const express = require('express');
const cors = require('cors');
const { pool } = require('pg');
require ('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());