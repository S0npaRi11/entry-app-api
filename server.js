if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const database = require('./Configs/Database'); 


const app = express();


// setting up database connection
database()


//app.use()'s
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/user', require('./Controllers/users'));
app.use('/book', require('./Controllers/books'));
app.use('/entry', require('./Controllers/entries'));
// app.use('/auth', require('./Controllers/authentication'));


app.listen(3000, () => {
    console.log('Server started on port 3000')
});

