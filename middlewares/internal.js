export const internal = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(401).json({ message: "Request is not authorized" });
    }
}