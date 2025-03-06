async function checkAdmin(request, response, next) {
    const user = await UserModel.findById(request.authUserData.id);
    if (!user || !user.admin) {
        return response.status(403).json({ message: "Forbidden: Admins only"});
    }
    next();
};

module.exports = {
    checkAdmin 
};
