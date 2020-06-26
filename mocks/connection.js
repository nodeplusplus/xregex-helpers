module.exports.REDIS_URI =
  process.env.XREGEX_REDIS_URI || "redis://127.0.0.1:6379";

module.exports.MONGO_URI =
  process.env.XREGEX_MONGO_URI || "mongodb://127.0.0.1:27017";

module.exports.MONGO_DATABASE = process.env.XREGEX_MONGO_DATABASE || "test";
