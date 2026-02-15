const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { getAssignedMembers, assignWorkoutPlan, assignDietPlan, getMemberWorkoutPlan, getMemberDietPlan, updateMemberProgress } = require('../controllers/trainerController');

router.use(protect, authorizeRoles('trainer'));
router.get('/members', getAssignedMembers);
router.post('/workout-plan', assignWorkoutPlan);
router.post('/diet-plan', assignDietPlan);
router.get('/member/:memberId/workout-plan', getMemberWorkoutPlan);
router.get('/member/:memberId/diet-plan', getMemberDietPlan);
router.put('/member/:memberId/progress', updateMemberProgress);

module.exports = router;
