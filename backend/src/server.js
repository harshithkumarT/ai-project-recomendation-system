import app from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureDefaultPromptTemplate } from "./models/promptTemplateModel.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    await ensureDefaultPromptTemplate();

    app.listen(env.PORT, () => {
      console.log(`Backend listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
