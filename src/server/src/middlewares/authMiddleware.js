const jwt = require("jsonwebtoken");

// Function to validate JWT
async function validateToken (request, response, next) {
    const authHeader = request.headers.authorization;

    // Check if authorisation header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(401).json({ message: "Unauthorised: No token provided" });
    }

    try {
        // Extract token from authorisation header
        const token = authHeader.split(" ")[1];
        // Verify & decode token with JWT Secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.authUserData = decoded;
        next();
    } catch (error) {
        return response.status(401).json({ message: "Unauthorised: Invalid token" });
    }
}

module.exports = {
    validateToken
};