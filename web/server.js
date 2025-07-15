const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const contributionsRouter = require('./routes/contributions');
const issuesRouter = require('./routes/issues');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/contributions', contributionsRouter);
app.use('/api/issues', issuesRouter);

app.get('/', (req, res) => {
  res.send('Uku Backend API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;