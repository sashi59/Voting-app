const {validateToken} = require("../service/auth")

 function checkAuthViaTokenSetPaylaod(tokenName) {
    return (req, res, next)=>{

        const givenTokenCookieValue = req.cookies[tokenName];

        // Log the received cookie
        console.log("Received Cookie:", givenTokenCookieValue);

        if (!givenTokenCookieValue) {
            req.user = null;
            console.log("No token found. Moving to next middleware.");
            return next();
        }

        try {
            const userPayload = validateToken(givenTokenCookieValue);
            req.user = userPayload; // Attach the user payload to the request object
            console.log("Decoded User Payloade:", req.user); // Check what the payload contains
        } catch (error) {
            console.log("Token validation error:", error); // Log any token validation errors
            req.user = null;
        }

        return next();
    }
}

module.exports = checkAuthViaTokenSetPaylaod;