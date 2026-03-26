import express from "express";
import { logger } from "./logger";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info("Server started", { port: PORT });
});

export { app };
