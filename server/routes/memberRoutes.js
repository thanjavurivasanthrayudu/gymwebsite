const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { getMyWorkoutPlan, getMyDietPlan, getMyPayments } = require('../controllers/memberController');

router.use(protect, authorizeRoles('member'));
router.get('/workout-plan', getMyWorkoutPlan);
router.get('/diet-plan', getMyDietPlan);
router.get('/payments', getMyPayments);

module.exports = router;
