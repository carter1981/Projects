const express = require('express'),
	router = express.Router(),
	config = require('config'),
	fs = require('file-system'),
	shortId = require('shortid');

router.get('/api/set', (req, res) => {
	const data = getMyProductsSetFromDB();
	res.send(data);
});

router.post('/api/set', (req, res) => {
	const data = getMyProductsSetFromDB(),
		newSet = req.body;

	newSet.id = shortId.generate();

	data.push(newSet);
	setMyProductsSetToDB(data);

	res.send(newSet);
});

router.delete('/api/set/:id', (req, res) => {
	const data = getMyProductsSetFromDB();
	const indexOfItemToRemove = data.findIndex(item => {
		return item.id === req.params.id;
	});
	data.splice(indexOfItemToRemove, 1);
	setMyProductsSetToDB(data);

	res.sendStatus(204);
});

router.get('/api/set/:id', (req, res) => {
	const data = getMyProductsSetFromDB(),
		set = data.find(set => set.id === req.params.id);

	set ? res.send(set) : res.send();
});

function getMyProductsSetFromDB() {
	return JSON.parse(fs.readFileSync(config.get('database.set'), 'utf8'));
}

function setMyProductsSetToDB(data) {
	fs.writeFileSync(config.get('database.set'), JSON.stringify(data));
}

module.exports = router;