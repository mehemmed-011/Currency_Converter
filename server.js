const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// 1. PORT MƏSƏLƏSİ: Railway sənə PORT-u özü verir. 
// Əgər 3000-də qalsan, Railway onu bloklayacaq.
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/convert', async (req, res) => {
    try {
        const { from, to, amount, api_key } = req.query;

        const response = await axios.get(`https://api.currencybeacon.com/v1/convert`, {
            params: {
                api_key: api_key,
                from: from,
                to: to,
                amount: amount
            }
        });

        res.json(response.data);
    } catch (error) {
        // Loglarda xətanı daha aydın görmək üçün:
        console.error("API Xətası:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Server xətası baş verdi" });
    }
});

// 2. HOST MƏSƏLƏSİ: '0.0.0.0' əlavə etmək serverin kənara açılmasını təmin edir
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server ${PORT} portunda hazırdır!`);
});