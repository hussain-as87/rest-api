import express from "express";
import { Auther, auther_data } from "./classes/Auther.mjs";
import { Borrwer, borrwers_data } from "./classes/Borrower.mjs";
import { Book, books_data } from "./classes/Book.mjs";
import { validationResult, check } from "express-validator";
const app = express();

const data = borrwers_data;
export const borrwersRouter = express.Router();

//!fetch all borrwers
borrwersRouter.get("/", (req, res, next) => {
  res.json(
    data.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
    })
  );
  next();
});

//!find one borrwer
borrwersRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const borrwer = data.find((b) => b.id == id);
  if (!borrwer) {
    res.status(404).json({
      message: "not found !!",
    });
    return;
  }
  res.json(borrwer);
  next();
});

//!create new borrwer
borrwersRouter.post(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("f_name").notEmpty().isString(),
    check("l_name").notEmpty().isString(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const id = req.body.id;
    const borrwer = data.find((b) => b.id == id);
    if (borrwer) {
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

//!update the borrower
borrwersRouter.put(
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

//!delete the borrower
borrwersRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const borrwer_books = books_data.filter((b) => b.b_id == id);
  if (borrwer_books.length <= 1) {
    // search inside books array for borrower id then delete the borrower
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1);
        res.status(200).json({
          message: "borrower deleted successfully !!",
        });
        return;
      }
    }
  } else if (borrwer_books.length >= 1) {
    res.status(400).json({
      message: "can not delete it because of already exist in books !!",
    });
    return;
  }
  res.status(404).json({
    message: "The borrower with the given id was not found !!",
  });

  next();
});

//!fetch all books belongsto the borrwoer
borrwersRouter.get("/:id/books", (req, res, next) => {
  const id = req.params.id;
  const borrwer = data.find((b) => b.id == id);
  const borrwer_books = books_data.filter((b) => b.b_id == id);

  if (!borrwer || borrwer_books.length < 1) {
    res.status(404).json({
      message: "not found !!",
    });
    return;
  }
  res.json(borrwer_books);
  next();
});
