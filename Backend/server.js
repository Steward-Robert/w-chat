import express, { json } from "express";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
