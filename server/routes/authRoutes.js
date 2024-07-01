import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const users = [
  { id: 1, username: 'admin', password: 'admin' }
];

function authenticateUser(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}

router.post('/', (req, res) => {
  const { username, password } = req.body;

  const user = authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

  res.json({ token });
});

export default router;