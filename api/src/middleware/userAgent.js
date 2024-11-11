const userAgent = (req, res, next) => {
    const userAgent = req.get("User-Agent");
    if (
        userAgent &&
        userAgent.toLowerCase().includes("android") &&
        userAgent.toLowerCase().includes("wv")
    ) {
        req.CLIENT_BASE_URL = process.env.ANDROID_BASE_URL;
    } else {
        req.CLIENT_BASE_URL = process.env.VUE_BASE_URL;
    }
    next();
};

module.exports = userAgent;
