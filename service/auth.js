const JWT = require("jsonwebtoken")
const secret = "$Voting@123$";

async function createTokenForUser(user){
    const payload = {
        id: user._id,
        fullName: user.fullName,
    }

    const token  = JWT.sign(payload, secret);
    return token
}

async function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}