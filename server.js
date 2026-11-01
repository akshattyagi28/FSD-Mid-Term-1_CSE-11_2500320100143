const express = require("express");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/books", bookRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
