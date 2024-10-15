import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    if(req.path === '/all' && req.baseUrl=== '/coupons'){
        return next();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        console.log('passs', user)
        req.user = user;
        next();
    });
};

export default authenticateToken;