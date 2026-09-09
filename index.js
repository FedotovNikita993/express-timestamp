const express = require('express');
const app = express();

const PORT = 3000;

app.get('/timestamp', (req, res) => {
  res.json({
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});