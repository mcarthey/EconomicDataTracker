SET IDENTITY_INSERT FredSeries ON;
INSERT INTO FredSeries (Id, Name, Description, Enabled) VALUES 
(1, 'CPIAUCSL', 'Consumer Price Index for All Urban Consumers: All Items in U.S. City Average', 1),          -- Inflation indicator
(2, 'UNRATE', 'Civilian Unemployment Rate', 1),                                                             -- Unemployment rate
(3, 'GDPC1', 'Real Gross Domestic Product, Billions of Chained 2012 Dollars', 1),                           -- Real GDP as an economic growth indicator
(4, 'FEDFUNDS', 'Effective Federal Funds Rate', 1),                                                         -- Interest rate set by the Federal Reserve
(5, 'DGS10', '10-Year Treasury Constant Maturity Rate', 0),                                                 -- Long-term Treasury yield
(6, 'M2SL', 'M2 Money Stock (Seasonally Adjusted)', 0),                                                     -- Broad money supply
(7, 'PAYEMS', 'All Employees: Total Nonfarm Payrolls, Thousands of Persons', 1),                            -- Employment trends
(8, 'PCE', 'Personal Consumption Expenditures, Billions of Dollars', 1),                                    -- Consumer spending measure
(9, 'UMCSENT', 'University of Michigan: Consumer Sentiment Index', 0),                                      -- Consumer sentiment indicator
(10, 'HOUST', 'Housing Starts: Total, New Privately Owned Housing Units Started', 0),                       -- Housing market health
(11, 'INDPRO', 'Industrial Production Index', 1),                                                           -- Production in manufacturing, mining, and utilities
(12, 'SP500', 'S&P 500 Index, Monthly Close Price', 1),                                                     -- Stock market performance
(13, 'EXUSUK', 'U.S. / U.K. Foreign Exchange Rate', 0),                                                     -- Exchange rate example
(14, 'WALCL', 'Assets: Total Assets: Total Assets (Less Eliminations from Consolidation) at the Fed', 0),   -- Federal Reserve assets
(15, 'WPU00000000', 'Producer Price Index by Commodity: All Commodities', 1),                               -- Wholesale price trends
(16, 'GS10', '10-Year Treasury Constant Maturity (Nominal)', 1),                                            -- Nominal Treasury yield
(17, 'GS1', '1-Year Treasury Constant Maturity Rate', 0),                                                   -- Short-term Treasury yield
(18, 'GS5', '5-Year Treasury Constant Maturity Rate', 0),                                                   -- Mid-term Treasury yield
(19, 'RECPROUSM156N', 'Probability of U.S. Recession Predicted by Treasury Spread', 1),                     -- Recession probability
(20, 'MORTGAGE30US', '30-Year Fixed Rate Mortgage Average in the United States', 1);                        -- Mortgage rate indicator
SET IDENTITY_INSERT FredSeries OFF;
