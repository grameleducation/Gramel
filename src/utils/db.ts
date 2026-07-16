import "server-only";

import server_env from "./env.server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: server_env.DATABASE_URL,
});

export default pool;
