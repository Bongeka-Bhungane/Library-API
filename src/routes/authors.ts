import { Router, Request, Response } from 'express';

import { body, param, validationResult } from 'express-validator';

const router = Router()

let authors: Author[] = []