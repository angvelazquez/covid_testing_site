var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try
    {
        const token = req.headers.cookie.substring(4);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};