const jwt = require('jsonwebtoken');
const errorHandler = require('../Methods/errorHandler');

const varify = (req,res,next) => {

    const token = req.header('auth-token');

    if(!token) {
        const err = errorHandler.error401()
        res.json(err).status(err.code)
    }
   
    try{
        const varified = jwt.verify(token,process.env.JWT_SECRET_TOKEN);
        // this req.user here to quickly grab the authenticated user,not to authenticate it itself.
        req.user = varified;
        // console.log(req.user._id)
        next()
    }catch(error){
        // console.log('auth failed')
        //If varification fails, set req.user to null
        req.user = null;
        const err = errorHandler.error401()
        res.json(err).status(err.code)
    }
}

module.exports = varify;