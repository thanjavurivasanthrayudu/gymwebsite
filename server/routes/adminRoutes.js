const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    getAnalytics, getAllTrainers, createTrainer, updateTrainer, deleteTrainer,
    getAllMembers, createMember, updateMember, deleteMember,
    getAllPayments, createPayment
} = require('../controllers/adminController');

router.use(protect, authorizeRoles('admin'));
router.get('/analytics', getAnalytics);
router.route('/trainers').get(getAllTrainers).post(createTrainer);
router.route('/trainers/:id').put(updateTrainer).delete(deleteTrainer);
router.route('/members').get(getAllMembers).post(createMember);
router.route('/members/:id').put(updateMember).delete(deleteMember);
router.route('/payments').get(getAllPayments).post(createPayment);

module.exports = router;
