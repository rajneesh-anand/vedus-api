const express = require("express");
const cors = require("cors");
const path = require("path");

const user = require("./routes/user");
const order = require("./routes/order");
const product = require("./routes/product");
const auth = require("./routes/auth");
const file = require("./routes/file");
const contact = require("./routes/contact");
const testinomial = require("./routes/testinomial");
const subject = require("./routes/subject");
const service = require("./routes/service");

require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var allowedDomains = [
  "https://vedas.vercel.app",
  "https://vedas-admin.vercel.app",
  "https://www.vedusone.com",
  "https://www.admin.vedusone.com",
  "https://admin.vedusone.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/products", product);
app.use("/api/contact", contact);
app.use("/api", file);
app.use("/api/testinomial", testinomial);
app.use("/api/subject", subject);
app.use("/api/service", service);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
