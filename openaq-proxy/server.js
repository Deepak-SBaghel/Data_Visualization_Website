import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const getMeasurements = async (country) => {
  const url = `https://api.openaq.org/v2/measurements?country=${country}&date_from=2023-01-01T00:00:00Z&date_to=2023-01-31T23:59:59Z&limit=1000`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

app.get('/api/measurements', async (req, res) => {
  const countries = req.query.countries || 'IN,US,GB'; // Default to India, US, UK
  const countryList = countries.split(',');

  try {
    const dataPromises = countryList.map(country => getMeasurements(country));
    const results = await Promise.all(dataPromises);
    res.json(results.map((data, index) => ({ country: countryList[index], data: data.results })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
