import express from 'express'
const router = express.Router()
import {getAllWebsites,getOneById,createNewAnalysis} from '../controllers/index.ts'

router.get('/',getAllWebsites);
router.get('/:id',getOneById);
router.post('/',createNewAnalysis);

export default router;
