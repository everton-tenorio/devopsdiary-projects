import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.status(201).json({ id: user._id, username, email });
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

export async function getProfile(req: any, res: Response) {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
}

export async function listUsers(req: Request, res: Response) {
  const users = await User.find().select('-password');
  res.json(users);
}
