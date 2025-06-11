// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static('public'));

let courseData = [];

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    courseData = xlsx.utils.sheet_to_json(sheet);

    // Optional: delete uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.json({ message: 'File uploaded and processed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing file: ' + err.message });
  }
});

app.get('/search', (req, res) => {
  const { homeCourseTitle = '', homeCourseCode = '' } = req.query;

  const result = courseData.filter(course => {
    const title = (course.Home_Course_Title || '').toLowerCase().trim();
    const code = (course.Home_Course_Code || '').toLowerCase().trim();

    const titleMatch = homeCourseTitle ? title.includes(homeCourseTitle.toLowerCase().trim()) : true;
    const codeMatch = homeCourseCode ? code === homeCourseCode.toLowerCase().trim() : true;

    return titleMatch && codeMatch;
  });

  res.json(result);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
