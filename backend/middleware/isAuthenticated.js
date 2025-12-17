import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token not found"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        
        req.id = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized"
        });
    }
};

export default isAuthenticated;
