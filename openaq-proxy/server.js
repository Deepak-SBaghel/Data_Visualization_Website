import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(cors());


app.get('/api/measurements', async (req, res) => {
  let country="IN"

  const url = `https://api.openaq.org/v2/measurements?country=${country}&date_from=2023-01-01T00:00:00Z&date_to=2023-01-31T23:59:59Z&limit=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
