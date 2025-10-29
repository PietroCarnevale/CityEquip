exports.verifyAppAuth = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (key && key === process.env.API_KEY) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: invalid API key" });
};
