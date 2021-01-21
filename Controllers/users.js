const express =  require('express');
const users = require('../Models/User');
const crud = require('../Methods/CRUD');
const responce = require('../Configs/Responce');
const bcrypt=  require('bcrypt');
const authenticate = require('../Methods/authentication')
const jwt = require('jsonwebtoken');
const errorHandler = require('../Methods/errorHandler');
const books = require('../Models/Book');
const createMessage = require('../Methods/messages');

const router = express.Router();

router.route('/')
    // read all users
    .get(authenticate,async (req,res) => {
        await crud.readAll(users).then(result => {
            if(result){
                responce.result = result;
                responce.message = `Total ${result.length} users found`
                res.json(responce).status(200)
            }else{
                const err = errorHandler.error404();
                res.json(err).status(err.code)
            }
        }).catch(error => {
            // console.log('.catch for get user')
            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        });
       
    })
    // create a user (register)
    .post(async (req,res) => {
        await crud.findOne(users, {email: req.body.email}).then(avilableUser => {
            bcrypt.hash(req.body.password, 10, function(error, hash) {
                if(!avilableUser){
                    req.body.password = hash;
                    if(error){
                        const err = errorHandler.error500(error)
                        res.json(err).status(err.code)
                    }
                    crud.save(users, req.body).then(result => {
                        responce.code = 201
                        responce.result = result;
                        responce.message = `User created`
                        res.json(responce).status(201)
                    }).catch(error => {
                        const err = errorHandler.error500(error)
                        res.json(err).status(err.code)
                    })
                }else{
                    // console.log('.catch for post user')
                    const err = errorHandler.error400()
                    res.json(err).status(err.code)
                }
            })
            // .catch(error => {
            //     const err = errorHandler.error500(error)
            //     res.json(err).status(err.code)
            // });
        });
    })

router.get('/messages',authenticate,async(req,res) => {
    // console.log('authenticated')
    await crud.readOne(users,req.user._id).then(result => {
        // console.log('user found')
        if(result){
            // console.log(result)
            responce.result = result.messages;
            responce.message = `Total ${result.messages.length} messages found`
            res.json(responce).status(200)
        }else{
            // user not found
            const err = errorHandler.error404(error);
            res.json(err).status(err.code);
        }
    }).catch(error => {
        // console.log(error)
        // console.log('.catch for get user/messages')

        const err = errorHandler.error500(error)
        res.json(err).status(err.code)
    })
});

router.route('/books')
    // view all the books where the provoded id belongs to
    .get(authenticate,async (req,res) => {
        await crud.readAll(books,{'users': req.user._id}).then(result => {
           if(result){
                responce.result = result;
                responce.message = `Total ${result.length} books found`
                res.json(responce).status(200)
           }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code)
           }
        }).catch(error => {
            // console.log('.catch for get user/books')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        });
         
    })


router.route('/:id')
    // read  user
    .get(authenticate,async (req, res) => {
        await crud.readOne(users,req.params.id).then(result => {
           if(result){
                responce.result = result;
                responce.message = `User found`
                res.json(responce).status(200);
           }else{
                const err = errorHandler.error404();
                res.json(err).status(err.code)
           }
        }).catch(error => {
            // console.log('.catch for get user/id')
            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        });
    })
    // update  user
    .patch(authenticate,async (req,res) => {
        await crud.update(users,req.body,req.params.id).then(result => {
           if(result){
                responce.result = result;
                responce.message = `User updated`
                res.json(responce).status(200);
           }else{
               const err = errorHandler.error404();
               res.json(err).status(err.code)
           }
        }).catch(error => {
            // console.log('.catch for patch user/id')
            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        });
       
    })
    // delete  user
    .delete(authenticate,async (req,res) => {
        await crud.delete(users,req.params.id).then(result => {
           if(result) {
                responce.result = result;
                responce.message = `User deleted`
                res.json(responce).status(200);
           }else{
            const err = errorHandler.error404(error)
            res.json(err).status(err.code)
           }
        }).catch(error => {
            // console.log('.catch for delete user/id')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        });
        
    })


// reimpliment this whole route with new logic




// add the book to the user and vica versa
// router.route('/book/:userID/:bookID')
//     .post(authenticate,async(req,res) => {
//         // console.log(req.params.bookID)
//         // console.log(req.params.userID)

//         const userID = req.params.userID, bookID = req.params.bookID;
//         await crud.readOne(books, req.params.bookID).then(book => {
//             if(book.creatorID === req.user._id){
//                 const present = book.users.find(o => o === userID)

//                 console.log(present)
//                 // console.log('is book has the requested user ot not',present)
//                 if(!present){
//                     // console.log(req.params.userID)
//                     console.log(userID)
//                     book.users = book.users.push(userID);
//                     console.log(book.users)
//                     // console.log(book.users)
//                     crud.save(books,book).then(savedBook => {
//                         // console.log(savedBook)
//                         crud.readOne(users,userID).then(user => {
//                             const present = user.books.find( o => o.id === bookID)
//                             // console.log('is user already has this book or not', present)
//                             if(!present){
//                                 user.books = user.books.push(req.bookID)
//                                 // console.log(user.books)
//                                 crud.save(users,user).then(savedUser => {
//                                     // console.log(savedUser)
//                                     responce.result = [savedBook, savedUser];
//                                     responce.message = 'changes saved'
//                                     res.json(responce).status(200);
//                                 })
//                             }else{
//                                 const err = errorHandler.error400()
//                                 res.json(err).status(err.code)
//                             }
//                         })
//                     })
//                 }else{
//                     const err = errorHandler.error400()
//                     res.json(err).status(err.code)
//                 }
//             }else{
//                 // console.log('here it goes wrong')
//                 const err = errorHandler.error401()
//                 res.json(err).status(err.code)
//             }
//         }).catch(error => {
//             console.log('.catch for post user/book/userID/bookID')

//             const err = errorHandler.error500(error)
//             res.json(err).status(err.code)
//         })
//     })

//     .delete(authenticate,async(req,res) =>{
//         // for deleting a given book from the user and visa versa
//         await crud.readOne(books,req.params.bookID).then(result => {
//             if(result){
//                 const user = result.users.find(o => o.id === req.params.entryID);
//                 crud.update(books,{"$pull":{"users": user}},req.params.bookID).then(deletedResult => {
//                     // remove book from user
//                     crud.readOne(users,req.params.userID).then(user => {
//                         const book = user.books.find(o => o === req.params.bookID);
//                         crud.update(books,{"$pull":{"book": book}},req.params.userID).then(deletedUser => {
//                             responce.result = [deletedResult,deletedUser],
//                             responce.message = `changes saved`
//                             res.json(responce).status(200);
//                         })
//                     })
//                 })
//             }else{
//                 const err = errorHandler.error404()
//                 res.json(err).status(err.code);  
//             }
//         }).catch(error => {
//             console.log('.catch for delete user/book/userID/bookID')

//             const err = errorHandler.error500(error)
//             res.json(err).status(err.code);
//         })
//     })



router.route('/login')
    .post(async(req,res) => {
        // after successful login, give the user a jwt token
        await crud.findOne(users, {email: req.body.email}).then(user => {
            if(user){
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if(err){
                        const err = errorHandler.error500(error)
                        res.json(err).status(err.code)
                    }
                    if(result){
                        const token = jwt.sign(user.toJSON(),process.env.JWT_SECRET_TOKEN,{expiresIn:'1h'});

                        responce.result = token
                        responce.message = 'Authentication successful'
                        res.json(responce).status(200)
                    }else{
                        const err = errorHandler.error401()
                        res.json(err).status(err.code)
                    }
                });
            }else{
                const err = errorHandler.error401()
                res.json(err).status(err.code)
            }
        }).catch(error => {
           
            // console.log('.catch for post user/login')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        })
    })

// request route to request to add the book
router.route('/request/:bookID')
    .get(authenticate,async (req,res) =>{
        await crud.readOne(books,req.params.bookID).then(book => {
            if(book){
                // create a request message 
                const msg = createMessage(req.user, 'request',book);

                // send the message
                crud.readOne(users, book.creatorID).then(creator => {
                   if(creator && creator.id !== req.user.id){
                        creator.messages = creator.messages.push(msg);
                        crud.save(users,creator).then(() =>{
                            responce.result = null;
                            responce.message = `Message sent`;
                            res.json(responce).status(200)
                        })
                   }else{
                       // error because creator not found
                        const err = errorHandler.error400(error);
                        res.json(err).status(err.code);
                    }
                })
            }else{
                // error because book not found
                const err = errorHandler.error404(error);
                res.json(err).status(err.code);
            }
        }).then(error => {
            // console.log('.catch for get user/request/id')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        })
    })

// get all the messages of the user



router.route('/message/:id')
    // read a single message
    .get(authenticate, async(req,res) => {
        // :id is message id
        // console.log('authenticated')
        // find the user
        await crud.readOne(users,req.user._id).then(user => {
            if(user){
                // console.log('user found', user);
                // console.log(user.messages)
                // find the message with the id
                if(user.messages.length > 0){
                    // console.log(user.messages)
                    const reqMeg = user.messages.find(o => o.id === req.params.id);
                    // console.log(reqMeg)
              
                    // console.log('message found', reqMeg)
                    // send the found message
                    responce.result = reqMeg;
                    responce.message = `message found`;
                    res.json(responce).status(200)
                }else{
                    // message not found
                    const err = errorHandler.error404();
                    res.json(err).status(err.code);
                }
            }else{
                // user not found
                const err = errorHandler.error404(error);
                res.json(err).status(err.code);
            }
        }).catch(error => {
            // console.log('.catch for get user/message/id')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        })
      
       
    })

    .post(authenticate, async(req,res) => {
        // :id is sender id

        // create message
        const msg = createMessage(req.user, 'message', req.body);

        // get the user whom you want to send to
        await crud.readOne(users,req.params.id).then(user => {
            if(user){

                // push the message to the found user
                user.messages = user.messages.push(msg);

                // save the found user
                crud.save(users,user).then(() => {
                    responce.result = null;
                    responce.message = `message sent`
                    res.json(responce).status(200)
                }).catch(error => {

                    const err = errorHandler.error500(error)
                    res.json(err).status(err.code)
                })
            }else{
                //user not found
                const err = errorHandler.error404();
                res.json(err).status(err.code);
            }
        }).catch(error =>{
            // console.log('.catch for post user/message/id')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        })
    })

    .delete(authenticate, async (req,res) => {
        // :id is message id

        // find the user
        await crud.readOne(users, req.user._id).then(result => {
           if(result){
                const reqMeg = result.messages.find(o => o.id === req.params.id);

                // console.log(reqMeg)

               if(reqMeg){
                //    console.log('deleting started');
                    crud.update(users,{'$pull':{'messages': reqMeg}}, req.user._id).then(removedResult =>{
                        responce.result = removedResult.messages;
                        responce.message = `message removed`;
                        res.json(responce).status(200)
                    })
               }else{
                   // message not found
                //    console.log('message not found')
                   const err = errorHandler.error404();
                   res.json(err).status(err.code);
               }
           }else{
               // user not found
            //    console.log('user not found')
               const err = errorHandler.error404();
               res.json(err).status(err.code);
           }
        }).catch(error => {
            // console.log('.catch for delete user/message/id')

            const err = errorHandler.error500(error)
            res.json(err).status(err.code)
        })
    })

module.exports = router