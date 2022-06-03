import express from "express";
import { borrwersRouter } from "./Borrowers.mjs";
import { authersRouter } from "./Authers.mjs";
import { booksRouter } from "./Books.mjs";

export const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use("/borrowers", borrwersRouter);
apiRouter.use("/authers", authersRouter);
apiRouter.use("/books", booksRouter);
