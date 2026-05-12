const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 4000;

// Absolute base path (guaranteed correct)
const BASE = "/Users/mckinley/Sentinel_Safety/sentinel-app/legacy_next";

// Root page
app.get("/", (req, res) => {
  const filePath = BASE + "/page.tsx";

  if (!fs.existsSync(filePath)) {
    return res.send("Root NOT FOUND: " + filePath);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.send(`<pre>${content}</pre>`);
});

// Sub pages
app.get("/:page", (req, res) => {
  const pageName = req.params.page;

  const filePath = `${BASE}/${pageName}/page.tsx`;

  if (!fs.existsSync(filePath)) {
    return res.send("NOT FOUND: " + filePath);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  res.send(`<pre>${content}</pre>`);
});

app.listen(PORT, () => {
  console.log("Viewer running on http://localhost:" + PORT);
});
