if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const database = require('./Configs/Database'); 


const app = express();


// setting up database connection
database()


//app.use()'s
// app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, auth-token"
  );
  next();
});



// routes
app.use('/user', require('./Controllers/users'));
app.use('/book', require('./Controllers/books'));
app.use('/entry', require('./Controllers/entries'));
// app.use('/auth', require('./Controllers/authentication'));


app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000')
});

