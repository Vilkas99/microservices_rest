require("dotenv").config();
const redis = require("ioredis");

const redisClient = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("connected to redis successfully!");
});

redisClient.on("error", (error: any) => {
  console.log("Redis connection error :", error);
});

export default redisClient;
