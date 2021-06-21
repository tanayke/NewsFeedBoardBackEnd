const express = require('express');

const app = express();
const cors = require('cors');
const db = require('./models');
const { port } = require('./config/config');

const PORT = port || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// define routes
app.use('/api/users', require('./api/user'));
app.use('/api/reports', require('./api/report'));
app.use('/api/locations', require('./api/location'));
app.use('/api/categories', require('./api/category'));
app.use('/api/cards', require('./api/cards'));
app.use('/api/articles', require('./api/article'));
app.use('/api/auth', require('./api/auth'));

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
