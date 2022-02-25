const express = require("express");
const crypto = require("crypto");
const { hashSync, genSaltSync, hash } = require("bcrypt");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
const { userSignupValidator } = require("../helper/user-validator");
const jwt = require("jsonwebtoken");

const emailMailer = require("../helper/email");

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

  let emailExits = await prisma.user.count({
    where: {
      email: data.fields.email,
    },
  });

  let mobileExits = await prisma.user.count({
    where: {
      mobile: data.fields.mobile,
    },
  });

  if (emailExits > 0) {
    return res.status(503).json({
      message: " Email Id is already registered !",
    });
  }

  if (mobileExits > 0) {
    return res.status(503).json({
      message: "Mobile Number is already in use !",
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
          class: data.fields.class,
          medium: data.fields.medium,
          city: data.fields.city,
          state: data.fields.state,
          mobile: data.fields.mobile,
          whatsapp: data.fields.whatsapp,
          image: uploadResult.secure_url,
          userType: data.fields.userType,
          status: "Active",
        },
      });
      return res.status(200).json(await emailMailer.sendEmail(data));
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
          class: data.fields.class,
          medium: data.fields.medium,
          city: data.fields.city,
          state: data.fields.state,
          mobile: data.fields.mobile,
          whatsapp: data.fields.whatsapp,
          userType: data.fields.userType,
          status: "Active",
        },
      });
      return res.status(200).json(await emailMailer.sendEmail(data));
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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  let user = await prisma.user.findFirst({ where: { email: email } });
  if (!user) {
    return res
      .status(422)
      .json({ message: "You are not regsitered with this email address" });
  }
  console.log(user);
  let token = await prisma.verificationToken.findFirst({
    where: {
      user: { email: email },
    },
  });
  console.log(token);
  if (token) {
    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
      },
    });
  }

  let resetToken = jwt.sign({ email: email }, process.env.PWD_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  // const salt = genSaltSync(10);
  // const hashToken = hashSync(resetToken, salt);
  // console.log(hashToken);

  try {
    await prisma.verificationToken.create({
      data: {
        token: resetToken,
        user: { connect: { email: email } },
      },
    });

    const link = `https://www.vedusone.com/user/reset-password?access=${resetToken}`;
    await emailMailer.sendPasswordResetEmail({
      pwdLink: link,
      email: email,
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "something went wrong !" });
  }
});

router.post("/reset-password/reset/:access", async (req, res) => {
  const accessToken = req.params.access;
  const { password } = req.body;
  const { email } = jwt.verify(accessToken, process.env.PWD_TOKEN_SECRET);

  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Something went wrong !" });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

router.get("/reset-password/:access", async (req, res) => {
  const accessToken = req.params.access;
  console.log(accessToken);

  let tokenData = await prisma.verificationToken.findFirst({
    where: { token: accessToken },
  });
  if (!tokenData) {
    return res
      .status(403)
      .json({ message: "You are not authorized to reset password" });
  }

  jwt.verify(
    accessToken,
    process.env.PWD_TOKEN_SECRET,
    function (err, decoded) {
      console.log(decoded);
      if (err) {
        return res
          .status(403)
          .json({ message: "You are not authorized to reset password" });
      } else {
        return res.status(200).json({ message: "success" });
      }
    }
  );
});

module.exports = router;
