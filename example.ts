import { Portfolio, Stock } from './classes.ts';

// Examples of the portfolio working

// Valid Portfolio and Stock instances

const validPortfolioBuilder = () => {
    const initialPortfolioStocks = [
        new Stock('AAPL', 150, 10, 50),
        new Stock('GOOGL', 2800, 5, 30),
        new Stock('AMZN', 3400, 2, 20)
    ];

    const portfolio = new Portfolio(initialPortfolioStocks);

    // Example market stocks to rebalance the portfolio
    const marketStocks = [
        new Stock('AAPL', 155),
        new Stock('GOOGL', 2850),
        new Stock('AMZN', 3450),
    ];

    // Test case: Rebalance the portfolio with new market stock prices
    portfolio.rebalance(marketStocks);

    // Output the results
    console.log('Rebalanced Portfolio:');
    portfolio.stocks.forEach(stock => {
        console.log(`Stock: ${stock.name}, Price: ${stock.price}, Quantity: ${stock.quantity}, Target Allocation: ${stock.targetAllocation}, Action: ${stock.action}`);
    });
}

const negativeStockValuesBuilder = () => {
    try {

        const initialPortfolioStocks = [
            new Stock('AAPL', -150, 10, 50),
            new Stock('GOOGL', 2800, 5, 30),
            new Stock('AMZN', 3400, 2, 20)
        ];

        const portfolio = new Portfolio(initialPortfolioStocks);
    } catch (error: any) {
        console.error(error.message);
    }
}

const invalidTargetAllocationBuilder = () => {
    try {
        const initialPortfolioStocks = [
            new Stock('AAPL', 150, 10, 80), // Invalid target allocation
            new Stock('GOOGL', 2800, 5, 30),
            new Stock('AMZN', 3400, 2, 20)
        ];

        const portfolio = new Portfolio(initialPortfolioStocks);
    } catch (error: any) {
        console.error(error.message);
    }
}

const negativeQuantityBuilder = () => {
    try {
        const initialPortfolioStocks = [
            new Stock('AAPL', 150, -10, 50), // Invalid quantity
            new Stock('GOOGL', 2800, 5, 30),
            new Stock('AMZN', 3400, 2, 20)
        ];

        const portfolio = new Portfolio(initialPortfolioStocks);
    } catch (error: any) {
        console.error(error.message);
    }
}

// Run the examples

console.log('--- Valid Portfolio Example ---');
console.log("Negative action means sell, positive action means buy, 0 action means do nothing.");

validPortfolioBuilder();

console.log('\n--- Error Cases ---');
negativeStockValuesBuilder();
invalidTargetAllocationBuilder();
negativeQuantityBuilder();