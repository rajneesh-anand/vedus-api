const express = require("express");
const { hashSync, genSaltSync } = require("bcrypt");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
const { userSignupValidator } = require("../helper/user-validator");

const email = require("../helper/email");

const router = express.Router();
const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

router.post("/register", userSignupValidator(), async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  let user = await prisma.user.count({
    where: {
      email: data.fields.email,
    },
  });

  if (user > 0) {
    return res.status(503).json({
      message: " Email Id is already registered !",
    });
  }

  const salt = genSaltSync(10);
  const hashedPassword = hashSync(data.fields.password, salt);

  if (Object.keys(data.files).length !== 0) {
    const photo = await fs.promises
      .readFile(data.files.photo.path)
      .catch((err) => console.error("Failed to read file", err));

    const photo64 = parser.format(
      path.extname(data.files.photo.name).toString(),
      photo
    );
    const uploadResult = await cloudinaryUpload(photo64.content);
    try {
      await prisma.user.create({
        data: {
          name: data.fields.name,
          email: data.fields.email,
          password: hashedPassword,
          address: data.fields.address,
          city: data.fields.city,
          state: data.fields.state,
          mobile: data.fields.mobile,
          whatsapp: data.fields.whatsapp,
          image: uploadResult.secure_url,
          userType: data.fields.userType,
        },
      });
      return res.status(200).json(await email.sendEmail(data));
    } catch (error) {
      console.log(error);
      return res.status(503).send(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  } else {
    try {
      await prisma.user.create({
        data: {
          name: data.fields.name,
          email: data.fields.email,
          password: hashedPassword,
          address: data.fields.address,
          city: data.fields.city,
          state: data.fields.state,
          mobile: data.fields.mobile,
          whatsapp: data.fields.whatsapp,
          userType: data.fields.userType,
        },
      });
      return res.status(200).json(await email.sendEmail(data));
    } catch (error) {
      console.log(error);
      return res.status(503).json({ message: "Something went wrong !" });
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
});

module.exports = router;
