import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/hashPassword';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

export const registerUser = async (req: Request, res: Response,next:NextFunction) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    throw createHttpError(400, "Please fill all fields!")
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw createHttpError(409,'Username already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = new User({ username, password: hashedPassword, role });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error)
  }
};

export const loginUser = async (req: Request, res: Response,next:NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw createHttpError(400,'All fields are required');
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      throw createHttpError(400,"Invalid credentials")
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(400,"Invalid credentials")
    }

    // Check if the user is active
    if (!user.isActive) {
      throw createHttpError(403,"Your Account Deactivated!")
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error)
  }
};
