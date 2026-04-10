const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: 'Authentication failed. Token missing.' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access forbidden. Insufficient permissions.' });
            }

            next();
        } catch (err) {
            console.error('Auth Middleware Error:', err);
            res.status(401).json({ message: 'Authentication failed. Invalid token.' });
            
        }
    };
};

module.exports = authMiddleware;
