import http, { IncomingMessage, Server, ServerResponse } from "http";

const server: Server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {}
);
