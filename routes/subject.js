const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/:class/:medium", async (req, res) => {
  const className = req.params.class;
  const medium = req.params.medium;
  let searchtext = `${className}-${medium}`;

  switch (searchtext) {
    case "six-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/six-english.json"));
      break;
    case "six-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/six-hindi.json"));
      break;
    case "seven-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/seven-english.json"));
      break;
    case "seven-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/seven-hindi.json"));
      break;
    case "eight-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/eight-english.json"));
      break;
    case "eight-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/eight-hindi.json"));
      break;
    case "nine-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/nine-english.json"));
      break;
    case "nine-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/nine-hindi.json"));
      break;
    case "ten-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/ten-english.json"));
      break;
    case "ten-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/ten-hindi.json"));
      break;
    case "eleven-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/eleven-english.json"));
      break;
    case "eleven-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/eleven-hindi.json"));
      break;
    case "twelve-english":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/twelve-english.json"));
      break;
    case "twelve-hindi":
      res.header("Content-Type", "application/json");
      res.sendFile(path.join(__dirname, "../upload/class/twelve-hindi.json"));
      break;

    default:
      console.log(`Sorry, we didnt find anaything`);
  }
});

router.post("/:class/:medium", async (req, res) => {
  const className = req.params.class;
  const medium = req.params.medium;
  const fileType = `${className}-${medium}`;

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const rawData = fs.readFileSync(data.files.uploadedFile.path);

  switch (fileType) {
    case "six-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/six-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "six-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/six-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;

    case "seven-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/seven-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "seven-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/seven-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "eight-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/eight-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "eight-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/eight-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "nine-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/nine-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "nine-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/nine-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "ten-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/ten-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "ten-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/ten-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "eleven-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/eleven-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "eleven-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/eleven-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "twelve-english":
      fs.writeFile(
        path.join(__dirname, `../upload/class/twelve-english.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;
    case "twelve-hindi":
      fs.writeFile(
        path.join(__dirname, `../upload/class/twelve-hindi.json`),
        rawData,
        function (err) {
          if (err) {
            console.log(err);
            return res.json(error);
          }
          return res.status(200).json({
            message: "success",
          });
        }
      );
      break;

    default:
      console.log(`Sorry, we didnt find anaything`);
  }
});

module.exports = router;
