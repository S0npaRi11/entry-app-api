const express =  require('express');
const books = require('../Models/Book');
const crud = require('../Methods/CRUD');
const responce = require('../Configs/Responce');
const users=  require('../Models/User');
const eval = require('../Methods/evaluation');
const authenticate = require('../Methods/authentication')
const errorHandler = require('../Methods/errorHandler');
const { result } = require('../Configs/Responce');

const router = express.Router();

router.route('/')
    // read all books
    .get(authenticate,async (req,res) => {
        await crud.readAll(books).then(result => {
           if(result){
                responce.result = result,
                responce.message = `Total of ${result.length} books found`
                res.json(responce).status(200)
           }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code); 
           }
        })
        .catch(error => {
            const err = errorHandler.error500(error);
            res.json(err).status(err.code)
        });
    })
    // create a book
    .post(authenticate,async (req,res) => {
        await crud.save(books, req.body).then(result => {
            const present = result.users.includes(req.user.id);
            if(result && !present){
                crud.update(users,{"books": result.id}, result.creatorID).then(() => {
                    responce.result = result,
                    responce.message = `Book created`
                    res.json(responce).status(201)  
                })
            }else{
                const err = errorHandler.error400();
                res.json(err).status(err.code)
            }
        })
        .catch(error => {
            const err = errorHandler.error500(error);
            res.json(err).status(err.code)
        });
    })


router.route('/:id')
    // view  book
    .get(authenticate,async (req, res) => {
        await crud.readOne(books,req.params.id).then(result => {
            // console.log(result);
            const present = result.users.includes(req.user._id);
            // console.log(present);

            // console.log(result && present)
            if(result && present){
                // console.log('entered')
                // calculate monthly values
                const monthlyReceived = eval.monthly(result.entries,'received');
                // console.log(monthlyReceived);
                const monthlyPaid = eval.monthly(result.entries,'paid'); 
                // console.log(monthlyPaid);
               

                // update the values
                result.monthlyPaid = monthlyPaid, result.monthlyReceived = monthlyReceived;

                // save the book with updated values
                crud.save(books, result).then(result => {
                    responce.result = result,
                    responce.message = `Book found`
                    res.json(responce).status(200);
                })
            }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code); 
            }
        }).catch(error => {
            const err = errorHandler.error500(error);
            res.json(err).status(err.code)
        });
    })
    // update  book
    .patch(authenticate,async (req,res) => {
        await crud.update(books,req.body,req.params.id).then(result => {
            const present = result.users.includes(req.user._id);
           if(result && present){
                responce.result = result,
                responce.message = `Book updated`
                res.json(responce).status(200);
           }else{
                const err = errorHandler.error404();
                res.json(err).status(err.code)
           }
        }).catch(error => {
            const err = errorHandler.error500(error);
            res.json(err).status(err.code)
        });
       
    })
    // delete  book
    .delete(authenticate,async (req,res) => {
        // fisst, check if the logged in user is authorised to use this book or not

        await crud.readOne(books, req.params.id).then(result => {
            const present = result.users.includes(req.user._id);
            if(result && present){
                crud.delete(books,req.params.id).then(result => {
                    responce.result = result,
                    responce.message = `Book deleted`
                    res.json(responce).status(200);
                }).catch(error => {
                    const err = errorHandler.error500(error);
                    res.json(err).status(err.code)
                })
            }else{
                //error
                const err = errorHandler.error404();
                res.json(err).status(err.code)
            }
        }).catch(error => {
            const err = errorHandler.error500(error);
            res.json(err).status(err.code)
        })

        // crud.delete(books,req.params.id).then(result => {
        //     // const present = result.users.includes(req.user._id);
        //    if(result && present){
        //         responce.result = result,
        //         responce.message = `Book deleted`
        //         res.json(responce).status(200);
        //    }else{
        //         const err = errorHandler.error404();
        //         res.json(err).status(err.code)
        //    }
        // }).catch(error => {
        //     const err = errorHandler.error500(error);
        //     res.json(err).status(err.code)
        // });
    })


router.route('/user/:bookID')
    // look for the book with id in the users model
    .get(authenticate,async (req,res) => {
        await crud.readAll(users,{'books': req.params.bookID}).then(result => {
           if(result){
                responce.result = result,
                responce.message = `Total of ${result.length} users found`
                res.json(responce).status(200);
           }else{
                const err = errorHandler.error404();
                res.json(err).status(err.code)
           }
        }).catch(error => {
            const err = errorHandler.error500(error);
            res.json(err).status(err.code)
        });
    })

module.exports = router