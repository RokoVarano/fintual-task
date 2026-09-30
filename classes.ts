/*
You’re building a portfolio management module, part of a personal investments and trading app
Construct a simple Portfolio class that has a collection of Stocks. Assume each Stock has a “Current Price” method that receives the last available price. Also, the Portfolio class has a collection of “allocated” Stocks that represents the distribution of the Stocks the Portfolio is aiming (i.e. 40% META, 60% APPL)
Provide a portfolio rebalance method to know which Stocks should be sold and which ones should be bought to have a balanced Portfolio based on the portfolio’s allocation.
Add documentation/comments to understand your thinking process and solution
Important: If you use LLMs that’s ok, but you must share the conversations.
*/

// Portfolio has Stocks[] and rebalance(stocks: Stock[])
// Stock has currentPrice(stock: Stock)

/* Flow:

1. There is a PortFolio with different stock types, each with a quantity and a current price.
2. When a new "current price" is published, the Portfolio will update the corresponding stock using the rebalance method. 
This means the "current price" is actually a stock, and that there is a stock history.
3. Each stock type has a target allocation percentage. The sum of all allocation percentages should equal 100%.
*/

class Portfolio {
    // each stock in this list represents a different TYPE of stock, separated by name
    stocks: Stock[];

    // the stock history recycles the stock class, but each one is a snapshot of the state of the market.
    stockHistory: Stock[];

    constructor(stocks?: Stock[]) {
        this.stocks = stocks || [];
        this.stockHistory = [];

        // ensure target allocation percentages sum to 100%
        const totalAllocation = this.stocks.reduce((sum, stock) => sum + (stock.targetAllocation || 0), 0);
        if (totalAllocation !== 100) {
            throw new Error(`Total target allocation must equal 100%. Current total: ${totalAllocation}%`);
        }

        // ensure that there is no more than one stock with the same name in the portfolio
        const stockNames = this.stocks.map(stock => stock.name);
        const uniqueStockNames = new Set(stockNames);
        if (uniqueStockNames.size !== stockNames.length) {
            throw new Error(`There cannot be more than one stock with the same name in the portfolio.`);
        }
    }

    rebalance(stocks: Stock[]): void {
        // Sets the "action" fields of each stock type.
        // Assume a batch of stocks that can go from one to a very big number. WHEN to rebalance is out of scope for this task.

        // 1. Separate the stocks by name.
        // 2. Compare each name to the stocks in the portfolio. 
        // 3. If it exists, update the price. If it doesn't exist, don't do anything. If there is more than one stock with the same name, we will take the last one in the array, assuming it is the most recent for this exercise.

        const stockMap = stocks.reduce((map, stock) => {
            map[stock.name] = stock;
            return map;            
        }, {} as Record<string, Stock>);

        // 3.5 add the latest market stocks to the stock history.
        this.stockHistory.push(...Object.values(stockMap));

        this.stocks.forEach(stock => {
            if (stockMap[stock.name]) {
                stock.price = stockMap[stock.name].price;
            }
        });

        // 4. portfolio current value = sum of (stock.price * stock.quantity) for each stock in the portfolio
        // 5. For each stock in the portfolio, calculate the target value = portfolio current value * stock.targetAllocation
        // 6. For each stock in the portfolio, calculate the current value = stock.price * stock.quantity
        // 7. For each stock in the portfolio, calculate the action = (target value - current value) / stock.price
        // 8. If action is negative, it means we need to sell that amount of stocks. If action is positive, it means we need to buy that amount of stocks. If action is zero, it means we don't need to do anything.
        // 9. Update the "action" field of each stock in the portfolio with the calculated action.

        this.stocks.forEach(stock => {
            
            const portfolioCurrentValue = this.stocks.reduce((sum, s) => sum + (s.price * (s.quantity || 0)), 0);
            const targetValue = portfolioCurrentValue * (stock.targetAllocation / 100);
            const currentValue = stock.price * stock.quantity;
            stock.action = (targetValue - currentValue) / stock.price;
        });
    }
}

class Stock {
    // Honestly, I rather have separate classes for market stock and trader stock, but for the sake of this task, we will use the same class for both.

    // fields that represent the market's state. These are obligatory and cannot be changed by the user. Price cannot be negative.
    name: string;
    price: number;

    // fields that represent the user's configuration. These are optional. Quantity cannot be negative. Target allocation must be between 0 and 100.
    quantity: number;
    targetAllocation: number;

    // This is the recommended action to take to rebalance the portfolio. It is automatic. negative means sell, positive means buy, 0 means do nothing.
    action: number;

    constructor(name: string, price: number, quantity?: number , targetAllocation?: number) {
        this.name = name;
        this.price = price;
        this.quantity = quantity || 0;
        this.targetAllocation = targetAllocation || 0;
        this.action = 0;

        if (this.price <= 0) {
            throw new Error(`Price cannot be negative or zero. Current price: ${this.price}`);
        }

        if (this.quantity < 0) {
            throw new Error(`Quantity cannot be negative. Current quantity: ${this.quantity}`);
        }

        if (this.targetAllocation < 0 || this.targetAllocation > 100) {
            throw new Error(`Target allocation must be between 0 and 100. Current target allocation: ${this.targetAllocation}`);
        }
    }

    currentPrice(): {name: string, price: number} {
        // Asks for the current price of the stock. This is a read-only operation, and it does not change the state of the stock.
        return {name: this.name, price: this.price};
    }
}

export { Portfolio, Stock };