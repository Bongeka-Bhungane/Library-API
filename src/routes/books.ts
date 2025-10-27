import express, { Express } from "express";
import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Book, books } from "../models/books";
import { Author, authors } from "../models/authors";
import { error } from "console";

const router = express.Router();
let nextBookId = 1;

const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("year").isInt({ min: 1 }).withMessage("year must be a valid number"),
  body("authorId")
    .isInt({ min: 1 })
    .withMessage("authorId must be positive integer"),
];

router.post(
  "/",
  validateBook,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid author id" });

    const { title, year, authorId } = req.body;
    const authorExists = authors.some((a) => a.id === authorId);
    if (!authorExists)
      return res
        .status(400)
        .json({ message: "Book already exists for this author" });

    const newBook: Book = { id: nextBookId++, title, year, authorId };
    books.push(newBook);
    res.status(201).json(newBook);
  }
);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json(books);
});

router.get(
  "/:id",
  validateBook,
  (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const book = books.find((b) => b.id === id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  });

router.put("/:id", validateBook, (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    if (!book) return res.status(404).json({ message: "Book not found" })

        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(400).json({ erros: errors.array() });

        const { title, year, authorId } = req.body;

        const authorExists = authors.some((a) => a.id === authorId);
        if (!authorExists)
          return res.status(400).json({ message: "Invalid author Id" });

        book.title = title;
        book.year = year;
        book.authorId = authorId;

        res.json(book)
})

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ message: "Book not found"})

        books.splice(index, 1)
        res.status(204).send();
})

export default router;
