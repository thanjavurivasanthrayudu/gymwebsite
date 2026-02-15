const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { getAllWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController');

router.get('/', protect, getAllWorkouts);
router.get('/:id', protect, getWorkoutById);
router.post('/', protect, authorizeRoles('admin', 'trainer'), createWorkout);
router.put('/:id', protect, authorizeRoles('admin', 'trainer'), updateWorkout);
router.delete('/:id', protect, authorizeRoles('admin'), deleteWorkout);

module.exports = router;
