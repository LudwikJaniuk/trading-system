module.exports = {
	instance : function() {
		orders = [];
		transactions = [];

		// {acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
		function matchingOrder(a) {
			let pricePredicate = a.action == "sell" 
				? (o => o.unitPrice <= a.unitPrice)
				: (o => o.unitPrice >= a.unitPrice);

			let mo = orders
				.filter(o => o.item = a.item)
				.filter(o => o.action != a.action)
				.filter(pricePredicate);

			if (mo.length <= 0) {
				return;
			} 

			return mo[0];
		}

		return {
			getOrders : function() {
				return orders.slice();
			},
			pendingTransactions : function() {
				return transactions.slice();
			},
			registerOrder : function (o) {
				while(true) {
					if(!matchingOrder(o)) {
						orders.push(Object.assign({}, o));
						return;
					} 

					let t = {
						item: o.item,
						from: o.action == "sell" ? o.acc : matchingOrder(o).acc,
						to: o.action == "buy" ? o.acc : matchingOrder(o).acc,
						qty : Math.min(matchingOrder(o).qty, o.qty),
					}
					t.charge = matchingOrder(o).unitPrice * t.qty

					transactions.push(t);
					o.qty -= t.qty;
					matchingOrder(o).qty -= t.qty;

					orders = orders.filter(o => o.qty > 0);

					if(o.qty == 0) break;
				}
			}

		}
	}

}
