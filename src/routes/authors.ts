import { Router, Request, Response, NextFunction } from 'express';
import express from "express"
import { Author, authors } from '../models/authors';
import { body, param, validationResult } from 'express-validator';

const router = express.Router()

let nextId = 1;

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json(authors)
})

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>{
    const id = parseInt(req.params.id);
    const author = authors.find(a => a.id === id);
    if (!author){
        return res.status(404).json({ message: "Author not found"})
    } else {
        res.json(author)
    }
})

router.post("/", body("name").notEmpty().withMessage("Name id required"), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    const { name, bio } = req.body;
    const newAuthor: Author = { id: nextId++, name, bio };
    authors.push(newAuthor);
    res.status(201).json(newAuthor)
})

router.put("/:id", body("name").notEmpty().withMessage("name is requried!!"), (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const author = authors.find(a => a.id === id);

    if(!author) return res.status(404).json({ message: "Author not found"})

        const errors = validationResult(req);
        if(!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array()});
        }

        const { name, bio} = req.body;
        author.name = name;
        author.bio = bio;

        res.json(author)
   
})

router.delete("/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const authorIndex = authors.findIndex(a => a.id === id);

    if (authorIndex === -1) {
        return res.status(404).json({ message: "Author not found"})
    } 

    authors.splice(authorIndex, 1)
    res.status(204).send()
})

export default router