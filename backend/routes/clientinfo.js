const express = require('express');
const {
    createInfo,
    getInfo,
    getInfos,
    deleteInfo,
    updateInfo
} = require('../controllers/infoControllers')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth)

// GET all Info
router.get('/', getInfos);

// GET a single info
router.get('/:id', getInfo);

// POST a new info
router.post('/', createInfo );

// DELETE a info
router.delete('/:id', deleteInfo);

// UPDATE a info
router.patch('/:id', updateInfo);

module.exports = router