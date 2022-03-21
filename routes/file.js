const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/plans", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const rawData = fs.readFileSync(data.files.uploadedFile.path);

  try {
    fs.writeFile(
      path.join(__dirname, `../upload/plans-information.json`),
      rawData,
      function (err) {
        if (err) console.log(err);
        return res.status(200).json({
          status: "success",
          message: "File uploaded successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/pricing", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const rawData = fs.readFileSync(data.files.uploadedFile.path);

  try {
    fs.writeFile(
      path.join(__dirname, `../upload/plans-pricing.json`),
      rawData,
      function (err) {
        if (err) console.log(err);
        return res.status(200).json({
          status: "success",
          message: "File uploaded successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/about", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const rawData = fs.readFileSync(data.files.uploadedFile.path);

  try {
    fs.writeFile(
      path.join(__dirname, `../upload/${data.files.uploadedFile.name}`),
      rawData,
      function (err) {
        if (err) console.log(err);
        return res.status(200).json({
          status: "success",
          message: "File uploaded successfully",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.get("/plans", async (req, res) => {
  res.statusCode = 200;
  res.header("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "../upload/plans-information.json"));
});

router.get("/pricing", async (req, res) => {
  res.statusCode = 200;
  res.header("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "../upload/plans-pricing.json"));
});

router.get("/about", async (req, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "../upload/about.json"));
});

router.get("/pricing/:class/:medium", async (req, res) => {
  const className = req.params.class;
  const mediumName = req.params.medium;

  fs.readFile(
    path.join(__dirname, "../upload/plans-pricing.json"),
    (err, jsonData) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        return;
      }
      try {
        const pricingArray = JSON.parse(jsonData);

        const pricingData = pricingArray.filter(
          (ele) => ele.class === className && ele.medium === mediumName
        );

        console.log(pricingData);
        return res.status(200).json({ msg: "success", data: pricingData });
      } catch (err) {
        console.log(err);
        return res.status(500).send(error);
      }
    }
  );
});

router.get("/class/:class/:medium", async (req, res) => {
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

module.exports = router;
