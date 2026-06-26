import express from 'express';
import createActivity from './activities.controller';

const router = express.Router();

router.post('/', createActivity)

export default router;