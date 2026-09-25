require("dotenv").config();
const express = require("express");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");
const apiRoutes = require("./routes/apiRoutes");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Request received: ", req.method, req.url);
  next();
});
app.use("/admin", adminRoutes);
app.use("/", publicRoutes);
app.use("/api", apiRoutes);
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
