const express = require('express');
const cors = require('cors');
const router = require('./router');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port} - http://localhost:${port}`);
});