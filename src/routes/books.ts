import express from "express";
import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Book, books } from "../models/books";
import { authors } from "../models/authors";

const router = express.Router();
let nextBookId = 1;

const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("year").isInt({ min: 1 }).withMessage("Year must be a valid number"),
  body("authorId")
    .isInt({ min: 1 })
    .withMessage("authorId must be a positive integer"),
];

/* -----------------------------
   CREATE BOOK
----------------------------- */

router.post("/", validateBook, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, year, authorId } = req.body;

  /* AUTHOR MUST EXIST */

  const authorExists = authors.some((a) => a.id === authorId);
  if (!authorExists) {
    return res.status(400).json({ message: "Invalid author id" });
  }

  /* CONFLICT CHECK (duplicate book for same author) */

  const duplicate = books.find(
    (b) =>
      b.title.toLowerCase() === title.toLowerCase() && b.authorId === authorId,
  );

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Book already exists for this author" });
  }

  const newBook: Book = { id: nextBookId++, title, year, authorId };

  books.push(newBook);

  res.status(201).json(newBook);
});

/* -----------------------------
   GET BOOKS + ADVANCED QUERIES
----------------------------- */

router.get("/", (req: Request, res: Response) => {
  let results = [...books];

  const year = req.query.year as string;
  const search = req.query.search as string;
  const sort = req.query.sort as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  /* FILTER BY YEAR */

  if (year) {
    results = results.filter((book) => book.year === Number(year));
  }

  /* SEARCH BY TITLE */

  if (search) {
    const term = search.toLowerCase();

    results = results.filter((book) => book.title.toLowerCase().includes(term));
  }

  /* SORT */

  if (sort === "title") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "year") {
    results.sort((a, b) => a.year - b.year);
  }

  /* PAGINATION */

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedResults = results.slice(start, end);

  /* INCLUDE AUTHOR DETAILS */

  const data = paginatedResults.map((book) => {
    const author = authors.find((a) => a.id === book.authorId);

    return {
      ...book,
      author,
    };
  });

  res.json({
    total: results.length,
    page,
    limit,
    data,
  });
});
/* -----------------------------
   GET BOOK BY ID
----------------------------- */

router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const author = authors.find((a) => a.id === book.authorId);

  res.json({
    ...book,
    author,
  });
});

/* -----------------------------
   UPDATE BOOK
----------------------------- */

router.put("/:id", validateBook, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, year, authorId } = req.body;

  const authorExists = authors.some((a) => a.id === authorId);
  if (!authorExists) {
    return res.status(400).json({ message: "Invalid author Id" });
  }

  /* CONFLICT CHECK */

  const duplicate = books.find(
    (b) =>
      b.id !== id &&
      b.title.toLowerCase() === title.toLowerCase() &&
      b.authorId === authorId,
  );

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Book already exists for this author" });
  }

  book.title = title;
  book.year = year;
  book.authorId = authorId;

  res.json(book);
});

/* -----------------------------
   DELETE BOOK
----------------------------- */

router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(index, 1);

  res.status(204).send();
});

export default router;
