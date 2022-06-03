import express from "express";
import { Auther, auther_data } from "./classes/Auther.mjs";
import { Borrwer, borrwers_data } from "./classes/Borrower.mjs";
import { Book, books_data } from "./classes/Book.mjs";
import { validationResult, check } from "express-validator";

const app = express();

const data = auther_data;
export const authersRouter = express.Router();

//!fetch all authers
authersRouter.get("/", (req, res, next) => {
  res.json(
    data.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
    })
  );
  next();
});

//!find one auther
authersRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const auther = data.find((b) => b.id == id);
  if (!auther) {
    res.status(404).json({
      message: "not found !!",
    });
    return;
  }
  res.json(auther);
  next();
});

//!create new auther
authersRouter.post(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("f_name").notEmpty().isString(),
    check("l_name").notEmpty().isString(),
  ],
  (req, res, next) => {
    const id = req.body.id;
    const auther = data.find((b) => b.id == id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    if (auther) {
      res.status(404).json({
        message: "already exist !!",
      });
      return;
    }
    data.push(req.body);
    res.status(201).json(req.body);
    next();
  }
);

//!update the auther
authersRouter.put(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("f_name").notEmpty().isString(),
    check("l_name").notEmpty().isString(),
  ],
  (req, res, next) => {
    const id = req.body.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i] = req.body;
        res.status(200).json(req.body);
        return;
      }
    }
    res.status(404).json({
      message: "not found !!",
    });
    next();
  }
);

//!delete the auther
authersRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const auther_books = books_data.filter((b) => b.a_id == id);
  if (auther_books.length <= 1) {
    // search inside books array for auther id then delete the auther
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1);
        res.status(200).json({
          message: "auther deleted successfully !!",
        });
        return;
      }
    }
  } else if (auther_books.length >= 1) {
    res.status(400).json({
      message: "can not delete it because of already exist in books !!",
    });
    return;
  }
  res.status(404).json({
    message: "The auther with the given id was not found !!",
  });

  next();
});

//!fetch all books belongsto the auther
authersRouter.get("/:id/books", (req, res, next) => {
  const id = req.params.id;
  const auther = data.find((b) => b.id == id);
  const auther_books = books_data.filter((b) => b.a_id == id);

  if (!auther || auther_books.length < 1) {
    res.status(404).json({
      message: "not found !!",
    });
    return;
  }
  res.json(auther_books);
  next();
});
