module.exports = {
	instance : function() {
		orders = [];
		transactions = [];

		// {acc: "1", action: "sell", item: "1001",  qty: 1, unitPrice: 45},
		function matchingOrder(a) {
			let pricePredicate = a.action == "sell" 
				? (o => o.unitPrice >= a.unitPrice)
				: (o => o.unitPrice <= a.unitPrice);

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
				let m = matchingOrder(o);

				if(!m) {
					orders.push(Object.assign({}, o));
					return;
				} 

				let unitPrice = m.unitPrice;
				let qty = Math.min(m.qty, o.qty);

				if(o.action != "sell") {
					let tmp = o;
					o = m; 
					m = tmp;
				}

				let t = {
					item: o.item,
					from: o.acc,
					to: m.acc,
					qty,
					charge: unitPrice * qty
				}

				transactions.push(t);
				o.qty -= qty;
				m.qty -= qty;

				orders = orders.filter(o => o.qty > 0);
			}

		}
	}

}
