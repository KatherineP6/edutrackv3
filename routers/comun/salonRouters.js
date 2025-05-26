const express = require('express');
const router = express.Router();

// Placeholder route for salones
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Ruta de salones placeholder' });
});

module.exports = router;
