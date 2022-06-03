import express from "express";
import { Auther, auther_data } from "./classes/Auther.mjs";
import { Borrwer, borrwers_data } from "./classes/Borrower.mjs";
import { Book, books_data } from "./classes/Book.mjs";
import { validationResult, check } from "express-validator";
const app = express();

const data = books_data;
export const booksRouter = express.Router();

//!fetch all books
booksRouter.get("/", (req, res, next) => {
  if (req.query.page != undefined) {
    res.json(paginate(data, 5, req.query.page));
    return;
  }
  res.json(
    data.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
    })
  );
  next();
});

//!find one book
booksRouter.get("/:isbn([0-9]{9}-[1-9])", (req, res, next) => {
  const isbn = req.params.isbn;
  const book = data.find((b) => b.isbn == isbn);

  if (!book) {
    res.status(404).json({
      message: "not found !!",
    });
    return;
  }
  res.json(book);
  next();
});

//!create new book
booksRouter.post(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("isbn").notEmpty().matches("[0-9]{9}-[1-9]"),
    check("title").notEmpty().isObject(),
    check("pages").notEmpty().matches("[50-2000]"),
    check("b_id").notEmpty().isInt(),
    check("a_id").notEmpty().isInt(),
  ],
  (req, res, next) => {
    const id = req.body.id;
    const auther = auther_data.find((b) => b.id == req.body.a_id);
    const borrower = borrwers_data.find((b) => b.id == req.body.b_id);
    const book_id = data.find((b) => b.id == id);
    const book_isbn = data.find((b) => b.isbn == req.body.isbn);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    if (book_id || book_isbn) {
      res.status(404).json({
        message: "already exist !!",
      });
      return;
    } else if (!auther || !borrower) {
      res.status(404).json({
        message: `${auther ? "" : ", the auther not exist !!"} ${
          borrower ? "" : ", the borrower not exist !!"
        } `,
      });
      return;
    }
    const request = req.body;
    data.push(request);
    res.status(201).json(request);
    next();
  }
);

//!update the book
booksRouter.put(
  "/",
  [
    check("id").notEmpty().isInt(),
    check("isbn").notEmpty().matches("[0-9]{9}-[1-9]"),
    check("title").notEmpty().isObject(),
    check("pages").notEmpty().matches("[50-2000]"),
    check("b_id").notEmpty().isInt(),
    check("a_id").notEmpty().isInt(),
  ],
  (req, res, next) => {
    const isbn = req.body.isbn;
    const book = data.find((b) => b.isbn == isbn);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }else if (!book) {
      res.status(404).json({
        message: "not found !!",
      });
      return;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].isbn == isbn) {
        data[i] = req.body;
        res.status(200).json(req.body);
        return;
      }
    }

    next();
  }
);

//!delete the book
booksRouter.delete("/:isbn([0-9]{9}-[1-9])", (req, res, next) => {
  const isbn = req.params.isbn;
  const book = data.find((b) => b.isbn == isbn);
  if (!book) {
    res.status(404).json({
      message: "The book with the given id was not found !!",
    });
    return;
  }
  // search inside books array for book id then delete the book
  for (let i = 0; i < data.length; i++) {
    if (data[i].isbn == isbn) {
      data.splice(i, 1);
      res.status(200).json({
        message: "Book deleted successfully !!",
      });
      return;
    }
  }
  next();
});

//!pagination
function paginate(array, page_limit, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_limit, page_number * page_limit);
}
