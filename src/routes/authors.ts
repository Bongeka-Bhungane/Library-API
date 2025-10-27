import { Router, Request, Response } from 'express';
import { Author } from '../models/authors';
import { body, param, validationResult } from 'express-validator';

const router = Router()

let authors: Author[] = [] 

router.get("/", (req: Request, res:Response) => {
    res.status(200).json(authors)
})

router.get("/:id", [param("id").isInt().withMessage("Id must be an integer")],(req: Request, res: Response) => {
    const errors = validationResult(req)

    console.log(errors, "errors from express-validator middleware")

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const {id} = req.params
    const author = authors.find((author) => author.id === parseInt(id))

    if(!author){
        return res.status(404).send("Author not found")
    }

    res.status(200).json(author)
})

export default router