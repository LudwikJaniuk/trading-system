console.log("Hello world!");
console.log("Testing the trading application!");

var te = require("./tradingEngine.js").instance();

// TODO proper money handling
var orders = [
	{acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
	{acc: "2", action: "buy", item: "1001",  qty: 1, unitPrice: 45},
]

var expectedTransactions = [
	{from: "1", to: "2", item: "1001", qty: 1, charge: 45}
]

function assert(c, m) {
	if(!c) {
		console.log("FAIL");
		console.log(m);
		process.exit();
	}
}

assert(te.getOrders().length == 0, "Orders should be empty at first");
assert(te.pendingTransactions().length == 0, "No transactions at first");

te.registerOrder(orders[0]);
assert(te.pendingTransactions().length == 0, "Transactions should be empty after one");
assert(te.getOrders().length == 1, "We should see the order");

te.registerOrder(orders[1]);
assert(te.pendingTransactions().length == 1, "We should have a transaction now");
assert(te.getOrders().length == 0, "Mathicng orders should remove each other");
let actualTransaction = te.pendingTransactions()[0]
assert(actualTransaction.from == expectedTransactions[0].from, "from");
assert(actualTransaction.to == expectedTransactions[0].to, "to");
assert(actualTransaction.item == expectedTransactions[0].item, "item");
assert(actualTransaction.qty == expectedTransactions[0].qty, "qty");
assert(actualTransaction.charge == expectedTransactions[0].charge, "charge");

console.log("SUCCESS 1");


orders = [
	{acc: "1", action: "sell", item: "1001",  qty: 4, unitPrice: 45},
	{acc: "2", action: "buy", item: "1001",  qty: 3, unitPrice: 45},
]

expectedTransactions = [
	{from: "1", to: "2", item: "1001", qty: 3, charge: 45*3}
]

expectedOrders = [
	{acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
]

te = require("./tradingEngine.js").instance();

te.registerOrder(orders[0]);
te.registerOrder(orders[1]);
assert(te.pendingTransactions().length == 1, "transacstions");
assert(te.getOrders().length == 1, "orders");

assert(te.pendingTransactions()[0].from == expectedTransactions[0].from, "tr from");
assert(te.pendingTransactions()[0].to == expectedTransactions[0].to, "tr to");
assert(te.pendingTransactions()[0].item == expectedTransactions[0].item, "tr item");
assert(te.pendingTransactions()[0].qty == expectedTransactions[0].qty, "tr qty");
assert(te.pendingTransactions()[0].charge == expectedTransactions[0].charge, "tr charge");

assert(te.getOrders()[0].acc == expectedOrders[0].acc, "ord acc");
assert(te.getOrders()[0].action == expectedOrders[0].action, "ord action");
assert(te.getOrders()[0].item == expectedOrders[0].item, "ord item");
assert(te.getOrders()[0].qty == expectedOrders[0].qty, "ord qty");
assert(te.getOrders()[0].unitPrice == expectedOrders[0].unitPrice, "ord unitPrice");


console.log("SUCCESS2");
