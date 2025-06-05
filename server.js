const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const url = require("node:url");

const PORT = 500;
const HOSTNAME = "127.0.0.1";

const dataPath = path.join(__dirname, "data/products.json");

const server = http.createServer((req, res) => {
  const parsedURL = url.parse(req.url, true);
  const { pathname, query } = parsedURL;

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, "OK", { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Welcome to Shurah Product API!" }));
  } else if (req.method === "GET" && pathname === "/products" && !query.id) {
    fs.readFile(dataPath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Failed to read Products");
      }

      res.writeHead(200, "OK", { "content-type": "application/json" });
      res.end(data);
    });
  } else if (req.method === "GET" && pathname === "/products" && query.id) {
    res.writeHead(200, "OK", { "content-type": "application/json" });

    const queryId = query.id;
    const responseProduct = productsObj.filter(
      (productObj) => productObj.id == queryId
    );

    res.end(JSON.stringify(responseProduct));
  } else if (req.method === "POST" && pathname === "/products") {
    let reqData = "";
    req.on("data", (chunk) => {
      reqData += chunk;
    });

    req.on("end", () => {
      const parsedReqData = JSON.parse(reqData);

      const newProductsObj = [...productsObj];
      newProductsObj.push(parsedReqData);

      try {
        fs.writeFile(dataPath, `\n${JSON.stringify(newProductsObj)}`, (err) => {
          if (err) {
            res.writeHead(500);
            return res.end("Error saving data");
          }

          res.writeHead(201);
          res.end("Data recieved & saved");
        });
      } catch (err) {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });
  } else {
    res.writeHead(404, "Not Found", { "content-type": "text/html" });
    res.end("<h1>404! Page Not Found</h1>");
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
