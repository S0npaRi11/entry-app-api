// const localStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
// const users = require('../Models/User');
// const bcrypt = require('bcrypt');


// const initialize = (passport,getUserByEmail,getUserById) => {
//     const authenticateUser = (email,password,done) => {
//         users.findOne({email: email})
//         .then(user => {
//             if(!user) return done(null,false,{message: 'User not found'});

//             bcrypt.compare(password, user.password, (error, isMatch) => {
//                 if(error) throw error;
//                 if(isMatch) return done(null,user);
//                 else return done(null,false,{message: 'Incorrect Password'})
//             })
//         })
//     }

//     possport.use(new localStrategy({usernameField: 'email'}, authenticateUser));
//     passport.serializeUser((user, done) => done(null,user.id));
//     passport.deserializeUser((id, done) => done(null, getUserById(id)));
// } 

// module.exports = initialize