import express from 'express';
import { createActivity, listActivities } from './activities.controller';

const router = express.Router();

router.post('/', createActivity)
router.get('/', listActivities)

export default router;