import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Profile routes - pending setup' });
});

export default router;
