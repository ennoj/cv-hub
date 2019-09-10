const express = require('express');
const connectDB = require('./config/db');

const app = express();

///// YHDISTÄ MONGODB-TIETOKANTAAN /////
connectDB();

///// INIT MIDDLEWARE /////
app.use(express.json({ extended: false }));

///// ROUTET /////
app.get('/', (req, res) => res.send('API Käynnissä'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

///// KÄYNNISTÄ SERVU /////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`***** SERVU KÄYNNISSÄ, PORT: ${PORT} *****`)
);
