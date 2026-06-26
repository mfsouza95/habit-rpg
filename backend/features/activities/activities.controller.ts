import { Request, Response } from 'express';

export default function createActivity(req: Request, res: Response): void{
    res.json({ data: req.body })
}