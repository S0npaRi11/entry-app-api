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
// app.use(cors({
//     origin: 'http://localhost:3000'
// }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all('/*', (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token")
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS")
    
    next();
});
// app.use(useragent.express())



// routes
app.use('/user', require('./Controllers/users'));
app.use('/book', require('./Controllers/books'));
app.use('/entry', require('./Controllers/entries'));
// app.use('/auth', require('./Controllers/authentication'));


app.listen(process.env.PORT || 5000, () => {
    console.log('Server started on port 3000')
});

