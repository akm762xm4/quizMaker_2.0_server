import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActivation,
} from '../controllers/userControllers';

const router = express.Router();



// Get all users
router.get('/', getAllUsers);

// Get a user by ID
router.get('/:id', getUserById);

// Create a new user
router.post('/', createUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

// Activate/Deactivate a user
router.patch('/:id/toggle-activation', toggleUserActivation);

export default router;
