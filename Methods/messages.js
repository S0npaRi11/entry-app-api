/*

Perpose of this file is to return a message object with msg, acceptedURL, deniedURL, uID,uEmail,uName and tag

*/

const mongoose = require('mongoose')

const message = {
    msg: '',
    acceptedURL: '',
    deniedURL: '',
    senderID: '',
    senderEmail: '',
    senderFirstName: '',
    senderLastName: '',
    tag: '',
}

// this function will return a template message for every tag
// it will take a user(who is sending the message) and tag and info(book {id,title} for 'request', message for message and notify)

const messageCreator = (sender,tag,info = {}) => {

    // console.log('message sender',sender)

    // assign all the values that are not related to tag
    message.senderEmail = sender.email;
    message.senderID = sender._id;
    message.senderFirstName = sender.firstName;
    message.senderLastName = sender.lastName;

    // assign tag
    message.tag = tag

    //do all the tag related operations

    switch (tag) {
        case 'request':
            // If the user is requesting to be a author of the book to its creator

            // create the msg
            message.msg = `${sneder.firstName} ${sender.lastName} is requesting to be the user of the book ${info.title}`;

            //create acceptedURL
            message.acceptedURL = `user/book/${sender._id}/${info._id}`

            // create deniedURL
            message.deniedURL = `user/message/${sender._id}`;
            break;
    
        case 'message':
            // If a user is sending a message to another user

            //create msg
            message.msg = info.msg;
            message._id = mongoose.Types.ObjectId()

            //create acceptedURL (deletes the message)
            message.acceptedURL = `user/message/${message._id}`
            break;

        case 'notify':
            // If system sends the message

            //create msg
            message.msg = info.msg;
            message._id = mongoose.Types.ObjectId()


            //create acceptedURL (deletes the message)
            message.acceptedURL = `user/message/${message._id}`
            break
    }

    // after that, return message

    return message;

}

//export messageCreator

module.exports = messageCreator;