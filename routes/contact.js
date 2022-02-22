const express = require("express");
const { IncomingForm } = require("formidable");
const email = require("../helper/email");

const router = express.Router();

router.post("/", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  try {
    const result = await email.sendEmail(data);
    if (result.message === "success") {
      return res.status(200).json({ message: "success" });
    } else {
      throw new Error("Something went wrong !");
    }
  } catch (error) {
    console.log(error);
    return res.status(503).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

module.exports = router;
