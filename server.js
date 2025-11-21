const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_BOT_TOKEN = 'TON_TOKEN_BOT_ICI';

app.post('/check-links', async (req, res) => {
    const { links } = req.body;
    const results = {};

    for (const link of links) {
        try {
            const match = link.match(/discord\.gg\/([a-zA-Z0-9]+)/) || link.match(/discord\.com\/invite\/([a-zA-Z0-9]+)/);
            if (!match) {
                results[link] = false;
                continue;
            }
            const code = match[1];

            const response = await fetch(`https://discord.com/api/v10/invites/${code}`, {
                headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
            });

            results[link] = response.ok;
        } catch (e) {
            results[link] = false;
        }
    }

    res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
