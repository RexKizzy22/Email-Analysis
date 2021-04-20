import http, { IncomingMessage, Server, ServerResponse } from "http";
import api from "./controller";

type URL = string | undefined;

const port = 3005;

const server :Server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {

    if (req.method === "GET") {

      if (req.url === "/") {
          res.writeHead(200, {"Content-type": "application/json"});

          const data = await api.get();
          res.end(JSON.stringify(data));   

          req.on("error", (error) => {
              console.log("Error occured: ", error.message);
          });
      } else {
          res.writeHead(200, {"Content-type": "application/json"});
          const url: URL = req.url;
          const urlArray: string[]  = url ? url.split("/") : [];
          const id: URL = url ? urlArray.pop() : "";

          const response = await api.getOne(id);
          res.end(JSON.stringify(response));

          req.on("error", (error) => {
              console.log("Error occured: ", error.message);
          });
      }

    } else if (req.method === "POST") {

        if (req.url === "/") {
            res.writeHead(200);

            req.on("data", async (data) => {
                const parsedData = JSON.parse(data);
                const resp = await api.post(parsedData);
                res.end(JSON.stringify(resp));
            });


            req.on("error", (error) => {
                console.log("Error occured: ", error.message);
            });
        }

    } else if (req.method === "PUT") {

        res.writeHead(200);
        const url: URL = req.url;
        const urlArray: string[] = url ? url.split("/") : [];
        const id: URL = urlArray.pop();

        req.on("data", async (data) => {
            const resp = await api.put(id, JSON.parse(data));
            res.end(JSON.stringify(resp));
        });


        req.on("error", (error) => {
            console.log("Error occured: ", error.message);
        });

    } else if (req.method === "DELETE") {

        res.writeHead(200);
        const url: URL = req.url;
        const urlArray: string[] = url ? url.split("/") : [];
        const id: URL = urlArray.pop();

        const resp = await api.delete(id);

        res.end(JSON.stringify(resp));

        req.on("error", (error) => {
            console.log("Error occured: ", error.message);
        });
    }
  }
);
  
// Server
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});



