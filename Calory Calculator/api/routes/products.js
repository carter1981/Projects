const express = require('express'),
	router = express.Router(),
	config = require('config'),
	fs = require('file-system');

router.get('/api/products', (req, res) => {
	res.send(fs.readFileSync(config.get('database.products'), 'utf8'));
});

module.exports = router;