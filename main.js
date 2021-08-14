console.log("Hello world!");
console.log("Testing the trading application!");

function assert(c, m) {
	if(!c) {
		console.log("FAIL");
		console.log(m);
		process.exit();
	}
}

function test(options) {
	options = Object.assign({
		orders: [],
		expectedTransactions: [],
		expectedOrders: [],
		message: "Test message not filled out",
	}, options);

	console.log("TEST " + options.message);

	const te = require("./tradingEngine.js").instance();
	for (let order of options.orders) {
		te.registerOrder(order);
	}

	assert(te.getOrders().length == options.expectedOrders.length, "orders length");
	for(let i = 0; i < options.expectedOrders.length; i++) {
		assert(te.getOrders()[i].acc == options.expectedOrders[i].acc, "ord acc");
		assert(te.getOrders()[i].action == options.expectedOrders[i].action, "ord action");
		assert(te.getOrders()[i].item == options.expectedOrders[i].item, "ord item");
		assert(te.getOrders()[i].qty == options.expectedOrders[i].qty, "ord qty");
		assert(te.getOrders()[i].unitPrice == options.expectedOrders[i].unitPrice, "ord unitPrice");
	}

	assert(te.pendingTransactions().length == options.expectedTransactions.length, "transactions length");
	for(let i = 0; i < options.expectedTransactions.length; i++) {
		assert(te.pendingTransactions()[i].from == options.expectedTransactions[i].from, "tr from");
		assert(te.pendingTransactions()[i].to == options.expectedTransactions[i].to, "tr to");
		assert(te.pendingTransactions()[i].item == options.expectedTransactions[i].item, "tr item");
		assert(te.pendingTransactions()[i].qty == options.expectedTransactions[i].qty, "tr qty");
		assert(te.pendingTransactions()[i].charge == options.expectedTransactions[i].charge, "tr charge");
	}
	console.log("SUCCESS");
}

test({
	orders : [ ],
	expectedTransactions : [ ],
	message: "Nothing",
});

// TODO proper money handling
test({
	orders : [
		{acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
		{acc: "2", action: "buy", item: "1001",  qty: 1, unitPrice: 45},
	],
	expectedTransactions : [
		{from: "1", to: "2", item: "1001", qty: 1, charge: 45}
	],
	message: "sell 1 buy 1",
});

test({
	orders : [
		{acc: "1", action: "buy", item: "1001",  qty: 1, unitPrice: 45},
		{acc: "2", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
	],
	expectedTransactions : [
		{from: "2", to: "1", item: "1001", qty: 1, charge: 45}
	],
	message: "buy 1 sell 1",
});

test({
	orders : [
		{acc: "1", action: "sell", item: "1001",  qty: 4, unitPrice: 45},
		{acc: "2", action: "buy", item: "1001",  qty: 3, unitPrice: 45},
	],
	expectedTransactions : [
		{from: "1", to: "2", item: "1001", qty: 3, charge: 45*3}
	],
	expectedOrders : [
		{acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
	],
	message: "sell 4 buy 3",
});

test({
	orders : [
		{acc: "1", action: "buy", item: "1001",  qty: 4, unitPrice: 45},
		{acc: "2", action: "sell", item: "1001",  qty: 3, unitPrice: 45},
	],
	expectedTransactions : [
		{from: "2", to: "1", item: "1001", qty: 3, charge: 45*3}
	],
	expectedOrders : [
		{acc: "1", action: "buy", item: "1001",  qty: 1, unitPrice: 45},
	],
	message: "sell 4 buy 3",
});
