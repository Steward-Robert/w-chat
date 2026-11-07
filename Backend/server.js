import express from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";

configDotenv();
const app = express();
app.use(express.json());
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

// Make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
