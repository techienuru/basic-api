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
  } else if (req.method === "GET" && pathname === "/products") {
    fs.readFile(dataPath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Failed to read Products");
      }

      res.writeHead(200, "OK", { "content-type": "application/json" });
      res.end(data);
    });
  } else if (req.method === "POST" && pathname === "/products") {
    let reqData = "";
    req.on("data", (chunk) => {
      reqData += chunk;
    });

    req.on("end", () => {
      try {
        let reqDataObj = JSON.parse(reqData);

        fs.readFile(dataPath, { encoding: "utf-8" }, (err, data) => {
          if (err) {
            console.log("A file reading error occurred: ", err);
            res.writeHead(500);
            res.end("Error reading products file");
          }

          let products = JSON.parse(data);
          // Creating an ID for the new poduct
          const newId = products.length;
          // Putting the ID as the first property
          reqDataObj = { id: newId, ...reqDataObj };

          // Adding the new Product to the end of the Array (containing previous products)
          products.push(reqDataObj);

          fs.writeFile(dataPath, JSON.stringify(products), (err) => {
            if (err) {
              res.writeHead(500);
              res.end("Error saving new product");
            }

            res.writeHead(201);
            res.end("Product added successfully");
          });
        });
      } catch (err) {
        console.log("An error occurred: ", err);
        res.writeHead(404);
        res.end("Invalid JSON");
      }
    });
  } else if (req.method === "PUT" && pathname === "/products") {
    const { id } = query;
    let reqData = "";

    req.on("data", (chunk) => {
      reqData += chunk;
    });

    req.on("end", () => {
      try {
        const reqDataObj = JSON.parse(reqData);

        fs.readFile(dataPath, "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end("Error updating product. Failed to read file");
          }

          const productsObj = JSON.parse(data);

          const newProducts = productsObj.map((product) => {
            if (product.id == id) {
              const productId = product.id;
              const updatedProduct = { id: productId, ...reqDataObj };
              return updatedProduct;
            } else {
              return product;
            }
          });

          fs.writeFile(dataPath, JSON.stringify(newProducts), (err) => {
            if (err) {
              res.writeHead(500);
              res.end("Error updating file. Failed to write to file");
            }

            res.writeHead(201);
            res.end("Product updated successfully");
          });
        });
      } catch (err) {
        res.writeHead(500);
        res.end("Invalid JSON");
      }
    });
  } else if (req.method === "DELETE" && pathname === "/products") {
    try {
      const { id } = query;
      if (!id) {
        throw new Error("Invalid Parameter");
      }

      fs.readFile(dataPath, { encoding: "utf-8" }, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error deleting product. Failed to read");
        }
        const productsObj = JSON.parse(data);
        const newProducts = productsObj.filter((product) => product.id != id);

        fs.writeFile(dataPath, JSON.stringify(newProducts), (err) => {
          if (err) {
            res.writeHead(500);
            res.end("Error deleting product. Failed to write");
          }

          res.end("Product deleted successfully");
        });
      });
    } catch (err) {
      res.writeHead(404);
      res.end(err.message);
    }
  } else {
    res.writeHead(404, "Not Found", { "content-type": "text/html" });
    res.end("<h1>404! Page Not Found</h1>");
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
