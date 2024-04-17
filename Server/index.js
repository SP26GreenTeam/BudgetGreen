const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '65fa0ee42396a5001df1b103',
            'PLAID-SECRET': '',
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
        products: ['auth', 'income_verification', 'transactions'],
        user_token: 'user-sandbox-4a677ca0-4c48-43e1-b68c-5ee29ca50e66',
        income_verification: {
            income_source_types: ["bank"],
            bank_income: { 
                days_requested: 60 
            }, 
        },
        transactions: {
            days_requested: 200
        },
        webhook: 'https://a2ab-2601-c2-8301-de00-8094-d1a8-ff0e-2090.ngrok.io',
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

        const accounts = response.data.accounts;
    
        res.json(accounts); // Send accounts back to the client
    } catch (error) {
        console.error("Error fetching account balances:", error);
        res.status(500).json({ error: "Failed to fetch account balances" });
    }
});

app.post("/get_bank_income", async (req, res, next) => {
    try {
      const response = await plaidClient.creditBankIncomeGet({
        user_token: 'user-sandbox-4a677ca0-4c48-43e1-b68c-5ee29ca50e66',
        options: {
          count: 1,
        },
      });
      console.log("Plaid response:", JSON.stringify(response.data, null, 2));
      res.json(response.data);
    } catch (error) {
      next(error);
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

const syncTransactions = async () => {
    // Placeholder: Replace with actual access token retrieval logic
    const accessToken = accessToken; 

    let cursor; // Placeholder: Replace with actual logic to retrieve the cursor, if available
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;

    // Fetch all pages of transaction updates since the last cursor
    while (hasMore) {
        try {
            const response = await plaidClient.transactionsSync({
                access_token: accessToken,
                cursor: cursor, // The initial cursor is undefined or null
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
            return; // Handle the error as needed
        }
    }

    // Apply updates to the database or other storage
    // Placeholder: Replace with actual logic to apply the updates
    console.log('Synced transactions:', { added, modified, removed });
};


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


app.post('/plaid_webhook', async (req, res) => {
    const { webhook_type, webhook_code, item_id, new_transactions } = req.body;

    if (webhook_type === 'TRANSACTIONS' && webhook_code === 'SYNC_UPDATES_AVAILABLE') {
        // Handle the SYNC_UPDATES_AVAILABLE webhook
        console.log(`Sync updates available for item ID: ${item_id}`);
        syncTransactions();
        res.status(200).send('SYNC_UPDATES_AVAILABLE webhook received');
    } else {
        // Handle other webhooks or ignore
        res.status(200).send('Webhook received, but not a SYNC_UPDATES_AVAILABLE event');
    }
});

app.listen(8080, () => {
   console.log("server has started");
});