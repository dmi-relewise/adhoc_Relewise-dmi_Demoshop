const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const filePath = "src/product.json"; 

app.use(cors());
app.use(bodyParser.json());

// Update JSON route
app.post("/update-json", (req, res) => {
  const { productId, updates } = req.body;

  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const productIndex = jsonData.findIndex((product) => product.productId === productId);
    if (productIndex !== -1) {
      jsonData[productIndex] = {
        ...jsonData[productIndex],
        ...updates,
      };

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
      res.status(200).send({ message: "Product updated successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating JSON:", error);
    res.status(500).send({ error: "Failed to update JSON" });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
