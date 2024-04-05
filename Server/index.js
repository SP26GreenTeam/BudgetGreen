const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '65fa0ee42396a5001df1b103',
            'PLAID-SECRET': '40ba2993a0a84186e4fb2e594031e4',
        },
    },
});

const plaidClient = new PlaidApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post('/create_link_token', async function (request, response) {
    const plaidRequest = {
        user: {
            client_user_id: 'user',
        },
        client_name: 'Plaid Test App',
        products: ['auth', 'transactions'],
        transactions: {
            days_requested: 730
        },
        language: 'en',
        redirect_uri: 'http://localhost:5173/',
        country_codes: ['US'],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        response.status(500).send("failure");
        // handle error
    }
});

app.post("/accounts/balance/get", async function(req, res) {
    const accessToken = req.body.accessToken; // Access token sent in the body of the request
    try {
        const response = await plaidClient.accountsBalanceGet({
            access_token: accessToken,
        });
        
        // Log the entire response from Plaid to inspect its structure
        console.log("Plaid response:", JSON.stringify(response.data, null, 2));

        const accounts = response.data.accounts;
        // Optionally, log just the accounts part if that's what you're interested in
        console.log("Accounts data:", JSON.stringify(accounts, null, 2));

        res.json(accounts); // Send accounts back to the client
    } catch (error) {
        console.error("Error fetching account balances:", error);
        res.status(500).json({ error: "Failed to fetch account balances" });
    }
});


/*
app.post("/user/create", async (req, res) => {
    // Assuming the `client_user_id` is sent in the body of the request
    const { client_user_id } = req.body;

    // Constructing the request object for the Plaid API
    const request = {
        client_user_id,
    };

    try {
        // Making the call to Plaid's API to create the user
        const response = await plaidClient.userCreate(request);
        // Sending back the response from Plaid to the client
        res.json(response.data);
        console.log(response.data)
    } catch (error) {
        console.error("Error creating user:", error);
        // Responding with an error message
        res.status(500).json({ error: "Failed to create user" });
    }
});
*/

/*
app.post("/transactions/sync", async (req, res) => {
    const { accessToken, itemId } = req.body;

    // Check if item is ready for transaction sync
    const isReady = await checkIfItemReady(itemId);
    if (!isReady) {
        return res.status(202).json({ message: "Data not ready yet." });
    }

    // Retrieve the latest cursor for this item, if it exists
    let cursor = await database.getLatestCursorOrNull(itemId);

    // Prepare to accumulate transaction updates
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;

    // Fetch all pages of transaction updates since the last cursor
    while (hasMore) {
        try {
            const response = await plaidClient.transactionsSync({
                access_token: accessToken,
                cursor: cursor,
            });

            // Accumulate transaction updates
            added = added.concat(response.data.added);
            modified = modified.concat(response.data.modified);
            removed = removed.concat(response.data.removed);

            // Prepare for the next iteration
            hasMore = response.data.has_more;
            cursor = response.data.next_cursor;

        } catch (error) {
            console.error("Error fetching transactions:", error);
            return res.status(500).json({ error: "Failed to fetch transactions" });
        }
    }

    // Apply updates to the database
    await database.applyUpdates(itemId, added, modified, removed, cursor);

    // Respond with the accumulated transaction updates
    res.json({ added, modified, removed });
});
    };

    try {
        // First request to get initial transactions data
        let response = await plaidClient.transactionsGet(initialRequest);
        let transactions = response.data.transactions;
        const total_transactions = response.data.total_transactions;

        // Loop to fetch additional transactions pages if there are more transactions than initially fetched
        while (transactions.length < total_transactions) {
            const paginatedRequest = {
                access_token: accessToken,
                start_date: start_date || '2018-01-01', // Reuse or default
                end_date: end_date || '2020-02-01',   // Reuse or default
                options: {
                    offset: transactions.length, // Update offset to fetch next page of transactions
                },
            };

            response = await plaidClient.transactionsGet(paginatedRequest);
            transactions = transactions.concat(response.data.transactions);
        }

        // Respond with the aggregated transactions data
        res.json({ transactions, total_transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
 */

app.post("/auth", async function(request, response) {
   try {
       const access_token = request.body.access_token;
       const plaidRequest = {
           access_token: access_token,
       };
       const plaidResponse = await plaidClient.authGet(plaidRequest);
       response.json(plaidResponse.data);
   } catch (e) {
       response.status(500).send("failed");
   }
});

app.post('/item/public_token/exchange', async function (req, res, next) {
    const publicToken = req.body.public_token;
    if (!publicToken) {
        return res.status(400).send("Public token is required");
    }

    try {
        const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
        // Assuming the Plaid client library response structure is as documented
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id; 
        console.log("Access Token:", accessToken); // Logging for debugging
        res.json({ accessToken, itemId }); // Make sure this matches your client's expectation
    } catch (error) {
        console.error('Error exchanging public token:', error);
        return res.status(500).send("An error occurred while exchanging tokens");
    }
});


app.post('/plaid/webhook', async (req, res) => {
    const { webhook_type, webhook_code, item_id, new_transactions } = req.body;

    if (webhook_type === 'TRANSACTIONS' && webhook_code === 'INITIAL_UPDATE') {
        console.log(`Received INITIAL_UPDATE for item_id: ${item_id} with ${new_transactions} new transactions.`);
        // Here, you would mark the item_id as ready to fetch transactions in your database
        await markItemReady(item_id);
    }

    res.sendStatus(200); // Acknowledge receipt of the webhook
});

app.listen(8080, () => {
   console.log("server has started");
});