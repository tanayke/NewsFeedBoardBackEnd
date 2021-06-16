const express = require('express');
const app = express();
const db = require('./models');
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/reports', require('./routes/api/report'));
app.use('/api/locations', require('./routes/api/location'));
app.use('/api/categories', require('./routes/api/category'));
app.use('/api/cards', require('./routes/api/cards'));
app.use('/api/articles', require('./routes/api/article'));
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('listening on port 3000');
  });
});
