import { app } from "../server/app";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

// Initialize the server and routes
// We create a server instance to satisfy the registerRoutes signature,
// but Vercel manages the actual execution.
const server = createServer(app);
registerRoutes(server, app);

// Export the Express app as the default handler for Vercel
export default app;
