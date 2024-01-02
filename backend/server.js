require('dotenv').config();

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}


const express = require('express');
const axios = require('axios');
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('GET REQUEST');
});

const api = axios.create({
    method: 'GET',
    baseURL: 'https://pro-api.coinmarketcap.com',
    headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        Accept: 'application/json',
        'Accept-Encoding': 'deflate, gzip',
    },
});

app.get('/api', (req, res) => {
    api('/v1/cryptocurrency/map?limit=100')
        .then(response => response.data)
        .then(value => res.json(value.data))
        .catch(err => console.log(err));
});

app.get('/target/api', (req, res) => {
    api('/v1/fiat/map')
        .then(response => response.data)
        .then(value => res.json(value.data))
        .catch(err => console.log(err));
});

app.get('/convert/api', (req, res) => {
    const { amount, symbol, convert } = req.query;
    api(`/v2/tools/price-conversion?amount=${amount}&symbol=${symbol}&convert=${convert}`)
        .then(response => response.data)
        .then(value => res.json(value.data))
        .catch(err => console.log(err));
});

app.listen(4000, () => {
    console.log('server is running');
});