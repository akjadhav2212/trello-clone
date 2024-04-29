const jwt = require('jsonwebtoken')
async function authMiddleware(req, res, next){
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
}
module.exports = authMiddleware