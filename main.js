console.log("Hello world!");
console.log("Testing the trading application!");

const te = require("./tradingEngine.js").instance();

// TODO proper money handling
const orders = [
	{acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
	{acc: "2", action: "buy", item: "1001",  qty: 1, unitPrice: 45},
]

const expectedTransactions = [
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

console.log("SUCCESS");
