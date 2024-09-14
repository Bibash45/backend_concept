const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public", "products.json")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(get404);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
