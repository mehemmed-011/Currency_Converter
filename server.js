const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Brauzerinizdən gələn sorğuları bloklamaması üçün CORS-u aktiv edirik
app.use(cors());

app.get('/convert', async (req, res) => {
    try {
        // Frontend-dən gələn parametrləri alırıq
        const { from, to, amount, api_key } = req.query;

        // Sorğunu sizin əvəzinizdən server göndərir (CORS burada mane olmur)
        const response = await axios.get(`https://api.currencybeacon.com/v1/convert`, {
            params: {
                api_key: api_key,
                from: from,
                to: to,
                amount: amount
            }
        });

        // API-dan gələn cavabı birbaşa frontend-ə göndəririk
        res.json(response.data);
    } catch (error) {
        console.error("Xəta baş verdi:", error.message);
        res.status(500).json({ error: "Server xətası baş verdi" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server http://localhost:${PORT} ünvanında hazırdır!`);
});