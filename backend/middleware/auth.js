const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
        
        // Add user info to request
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired. Please login again.' 
            });
        }
        
        return res.status(401).json({ 
            message: 'Invalid token' 
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        return res.status(403).json({ 
            message: 'Access denied. Admin only.' 
        });
    }
};

const isTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'Teacher') {
        next();
    } else {
        return res.status(403).json({ 
            message: 'Access denied. Teacher only.' 
        });
    }
};

const isStudent = (req, res, next) => {
    if (req.user && req.user.role === 'Student') {
        next();
    } else {
        return res.status(403).json({ 
            message: 'Access denied. Student only.' 
        });
    }
};

module.exports = { 
    authMiddleware, 
    isAdmin, 
    isTeacher, 
    isStudent 
};