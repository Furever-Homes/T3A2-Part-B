const { User } = require("../models/UserModel");

async function checkAdmin(request, response, next) {
  const user = await User.findById(request.authUserData.userId);
  if (!user || !user.admin) {
    return response.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

module.exports = {
    checkAdmin 
};