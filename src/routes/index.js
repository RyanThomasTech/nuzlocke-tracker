import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  return res.status(200).json({message: 'Welcome to the Nuzlocke tracker!'});
});

export default router;
