const CRUD = {

    readAll(collection, finder = {}){
        return collection.find(finder)
    },

    readOne(collection, identifier){
        return collection.findById(identifier)
    },

    update(collection,updatedObjct,identifier){
        return collection.findByIdAndUpdate(identifier,updatedObjct)
    },

    delete(collection,identifier){
        return collection.findByIdAndRemove(identifier)
    },

    findOne(collection, finder){
        return collection.findOne(finder)
    },
    save(collection, data){
        const newData = new collection(data)
        return newData.save()
    }
    // write create() function for all three models seperately (for now)
    // createBook(collection,data){
    //     const newBook = new collection({
    //         title: data.title,
    //         creatorID: data.creatorID,
    //         users: data.creatorID
    //     })
    //     return newBook.save()
    // },

    // createEntry(collection,data){
    //     const newEntry = new collection({
    //         title: data.title,
    //         creatorID: data.creatorID,
    //         bookID: data.bookID,
    //         amount: data.amount,
    //         details: data.details,
    //         recepient: data.recepient,
    //         type: data.type
    //     })
    //     return newEntry.save()
    // },

    // createUser(collection,data){

    //     // salting will take place here

    //     const newUser = new collection({
    //         firstName: data.firstName,
    //         lastName: data.lastName,
    //         email: data.email,
    //         mobileNumber: data.mobileNumber,
    //         password: data.password
    //     })
    //     return  newUser.save()
    // }
}

module.exports = CRUD;