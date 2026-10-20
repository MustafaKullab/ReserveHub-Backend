const sendError = (
    res,
    message,
    status,
    errors = {}
) => {
    return res.status(status).json({
        success: false,
        message: message || "Something went wrong.",
        errors
    });
};

module.exports = sendError;