const express = require("express");
const cors = require("cors");
const routes = require('./routes/inventoryRoutes'); // make sure path is correct
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.json({ message: "Server running ✅" }));

// All routes prefixed with /api
app.use("/api", routes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
