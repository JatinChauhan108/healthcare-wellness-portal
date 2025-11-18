import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Reminder routes - pending setup' });
});

export default router;
