const express =  require('express');
const books = require('../Models/Book');
const crud = require('../Methods/CRUD');
const errorHandler = require('../Methods/errorHandler');
const responce = require('../Configs/Responce');
const eval = require('../Methods/evaluation');
const authenticate = require('../Methods/authentication')

const router = express.Router();

router.route('/:bookID')
    // read all entries of the particular book
    .get(authenticate,async (req,res) => {
        await crud.readOne(books,req.params.bookID).then(result => {
            const present = result.users.includes(req.user._id);
            if(result && present){
                responce.result = result.entries,
                responce.message = `Total ${result.entries.length} entries found`
                res.json(responce).status(200);
            }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code);
            }
        }).catch(error => {
            const err = errorHandler.error500(error)
            res.json(err).status(err.code);
        });
    })
    // create an entry of the perticular book
    .post(authenticate,async (req,res) => {
        await crud.readOne(books,req.params.bookID).then(result => {
            const present = result.users.includes(req.user._id);
            if(result && present){
                result.entries = result.entries.push(req.body)
                // increase the total value here
                if(req.body.type === 'received') result.totalReceived = eval.step(result.totalReceived, req.body.amount)
                else if(req.body.type === 'paid') result.totalPaid = eval.step(result.totalPaid, req.body.amount)
                else if(req.body.type === 'dept') result.totalDept = eval.step(result.totalDept, req.body.amount)
                else{
                    const err = errorHandler.error400()
                    res.json(err).status(err.code);  
                }

                crud.save(books, result).then(result => {
                    responce.result = result.entries,
                    responce.message = 'Entry created',
                    res.json(responce).status(200);
                }).then(error => {
                    const err = errorHandler.error500(error)
                    res.json(err).status(err.code);
                })
            }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code);  
            }
        }).catch(error => {
            const err = errorHandler.error500(error)
            res.json(err).status(err.code);
        })
    })


router.route('/:bookID/:entryID')
    // read a single entry
    .get(authenticate,async (req, res) => {
        await crud.readOne(books,req.params.bookID).then(result => {
            const present = result.users.includes(req.user._id);
           if(result && present){
                const entry = result.entries.find(o => o.id === req.params.entryID);
                responce.result = entry,
                responce.message = `Entry found`
                res.json(responce).status(200);
           }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code);  
           }
        }).catch(error => {
            const err = errorHandler.error500(error)
            res.json(err).status(err.code);
        });

    })
    // update a single entry (entry updates only work on entries with type dept, and they can only be updated to type paid at max)
    .patch(authenticate,async (req,res) => {
        await crud.readOne(books,req.params.bookID).then(result => {
            const present = result.users.includes(req.user._id);
            // console.log(result && present)
            if(result && present){
                const entry = result.entries.find(o => o.id === req.params.entryID);
                // console.log(entry)
                const entryIndex = result.entries.indexOf(entry);

                result.entries[entryIndex] = req.body;

                // console.log(req.body)

                //eval functions
                // if dept is paid(i.e. is reduced) add the cost with which it got reduced to totalPaid
                // if dept is added, just raise the totalDept

                // sign -1 means that the input amount is to be reduced 
                if(req.body.type === 'dept'){
                    result.totalDept -= entry.amount;
                    if(Math.abs(req.body.amount) < entry.amount && Math.sign(req.body.amount) === -1){
                        result.totalDept = eval.step(result.totalDept, req.body.amount);
                        result.totalPaid = eval.step(result.totalPaid, (entry.amount - req.body.amount));
                    }else if(Math.abs(req.body.amount) === entry.amount && Math.sign(req.body.amount) === -1){
                        // this for if dept is totally paid then:
                            //convert the entry type to paid
                            //reduce the entry.amount from totalDept
                            //add the entry.amount to totalPaid

                        entry.type = 'paid';
                        result.totalPaid = eval.step(result.totalPaid, antry.amount);
                    }else{
                        result.totalDept = eval.step(result.totalDept, req.body.amount);
                    }
                }else{
                    const err = errorHandler.error400()
                    res.json(err).status(err.code);  
                }

                // console.log(result)

                crud.save(books,result).then(result => {
                    responce.result = result.entries,
                    responce.message = 'Entry updated',
                    res.json(responce).status(200);
                }).catch(error => {
                    const err = errorHandler.error500(error)
                    err.additionalMessage = 'Error just before saving'
                    res.json(err).status(err.code);
                })
            }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code);  
            }
        }).catch(error => {
            const err = errorHandler.error500(error)
            err.additionalMessage = 'Error because of logic before saving'
            res.json(err).status(err.code);
        })
    })
    // delete a single entry
    .delete(authenticate,async (req,res) => {
        await crud.readOne(books,req.params.bookID).then(result => {
            const present = result.users.includes(req.user._id);
           if(result && present){
                const entry = result.entries.find(o => o.id === req.params.entryID);
                //minus the entry amount
                entry.amount = -(entry.amount);
                
                // change the logic from using $pull, to using .filter Method

//                 crud.update(books,{"$pull":{"entries": entry}},req.params.bookID).then(() => {
// 
//                     // update the values after deleting the entty
//                     if(entry.type === 'received') result.totalReceived = eval.step(result.totalReceived, entry.amount)
//                     else if(entry.type === 'paid') result.totalPaid = eval.step(result.totalPaid, entry.amount)
//                     else if(entry.type === 'dept') result.totalDept = eval.step(result.totalDept, entry.amount)
//                     else{
//                         const err = errorHandler.error400()
//                         res.json(err).status(err.code);  
//                     }
// 
//                     // save the book with updated values
//                     crud.save(books, result).then(result => {
//                         responce.result = result,
//                         responce.message = `Entry deleted`
//                         res.json(responce).status(200);
//     
//                     })
//                 })
                
                // first, filter the found entry from the result.entries array and save back to it
                result.entries = result.entries.filter((entry) => entry.id !== req.params.entryID)
                
                // then perform the calculations
                if(entry.type === 'received') result.totalReceived = eval.step(result.totalReceived, entry.amount)
                else if(entry.type === 'paid') result.totalPaid = eval.step(result.totalPaid, entry.amount)
                else if(entry.type === 'dept') result.totalDept = eval.step(result.totalDept, entry.amount)
                else{
                    const err = errorHandler.error400()
                    res.json(err).status(err.code);  
                }
                
                // then save the book
                crud.save(books, result).then(result => {
                         responce.result = result,
                         responce.message = `Entry deleted`
                         res.json(responce).status(200);
     
                     })
           }else{
                const err = errorHandler.error404()
                res.json(err).status(err.code);  
           }
        }).catch(error => {
            const err = errorHandler.error500(error)
            res.json(err).status(err.code);
        })
    })



module.exports = router
