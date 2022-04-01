const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

router.post("/", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

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
      await prisma.service.create({
        data: {
          name: data.fields.name,
          description: data.fields.description,
          slug: data.fields.slug,
          status: data.fields.status,
          image: uploadResult.secure_url,
          price: Number(data.fields.price),
          discountedPrice: Number(data.fields.discountedPrice),
          discount:
            data.fields.price === "0"
              ? 0
              : parseFloat(data.fields.price) -
                (parseFloat(data.fields.discountedPrice) /
                  parseFloat(data.fields.price)) *
                  100,
        },
      });
      return res.status(200).json({ msg: "success" });
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
      await prisma.service.create({
        data: {
          name: data.fields.name,
          description: data.fields.description,
          slug: data.fields.slug,
          status: data.fields.status,
          price: Number(data.fields.price),
          discountedPrice: Number(data.fields.discountedPrice),
          discount:
            data.fields.price === "0"
              ? 0
              : parseFloat(data.fields.price) -
                (parseFloat(data.fields.discountedPrice) /
                  parseFloat(data.fields.price)) *
                  100,
        },
      });
      return res.status(200).json({ msg: "success" });
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

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

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
      await prisma.service.update({
        where: {
          id: Number(id),
        },
        data: {
          data: {
            name: data.fields.name,
            description: data.fields.description,
            slug: data.fields.slug,
            status: data.fields.status,
            image: uploadResult.secure_url,
            price: Number(data.fields.price),
            discountedPrice: Number(data.fields.discountedPrice),
            discount:
              data.fields.price === "0"
                ? 0
                : parseFloat(data.fields.price) -
                  (parseFloat(data.fields.discountedPrice) /
                    parseFloat(data.fields.price)) *
                    100,
          },
        },
      });
      return res.status(200).json({ msg: "success" });
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
      await prisma.service.update({
        where: {
          id: Number(id),
        },
        data: {
          name: data.fields.name,
          description: data.fields.description,
          slug: data.fields.slug,
          status: data.fields.status,
          price: Number(data.fields.price),
          discountedPrice: Number(data.fields.discountedPrice),
          discount:
            data.fields.price === "0"
              ? 0
              : parseFloat(data.fields.price) -
                (parseFloat(data.fields.discountedPrice) /
                  parseFloat(data.fields.price)) *
                  100,
        },
      });
      return res.status(200).json({ msg: "success" });
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

// -------------------

const APP_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.vedusone.com/api"
    : "http://localhost:8080/api";

function paginate(totalItems, currentPage, pageSize, count, url) {
  const totalPages = Math.ceil(totalItems / pageSize);

  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // calculate start and end item indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // return object with all pager properties required by the view
  return {
    total: totalItems,
    currentPage: +currentPage,
    count,
    lastPage: totalPages,
    firstItem: startIndex,
    lastItem: endIndex,
    perPage: pageSize,
    first_page_url: `${APP_URL}${url}&page=1`,
    last_page_url: `${APP_URL}${url}&page=${totalPages}`,
    next_page_url:
      totalPages > currentPage
        ? `${APP_URL}${url}&page=${Number(currentPage) + 1}`
        : null,
    prev_page_url:
      totalPages > currentPage ? `${APP_URL}${url}&page=${currentPage}` : null,
  };
}

router.get("/", async (req, res) => {
  const { orderBy, sortedBy } = req.query;
  const curPage = req.query.page || 1;
  const perPage = req.query.limit || 25;

  const url = `/service?limit=${perPage}`;

  const skipItems =
    curPage == 1 ? 0 : (parseInt(perPage) - 1) * parseInt(curPage);

  const totalItems = await prisma.service.count();

  try {
    const result = await prisma.service.findMany({
      skip: skipItems,
      take: parseInt(perPage),
      orderBy: {
        createdAt: sortedBy,
      },
    });
    // console.log(product.length);
    res.status(200).json({
      msg: "success",
      data: result,
      ...paginate(totalItems, curPage, perPage, result.length, url),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

router.get("/home", async (req, res) => {
  const { orderBy, sortedBy } = req.query;
  const curPage = req.query.page || 1;
  const perPage = req.query.limit || 6;

  const skipItems =
    curPage == 1 ? 0 : (parseInt(perPage) - 1) * parseInt(curPage);

  try {
    const result = await prisma.service.findMany({
      skip: skipItems,
      take: parseInt(perPage),
      where: {
        status: "Active",
      },
      orderBy: {
        createdAt: sortedBy,
      },
    });

    res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await prisma.service.findFirst({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

module.exports = router;
