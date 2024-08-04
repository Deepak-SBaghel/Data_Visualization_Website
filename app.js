google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.setOnLoadCallback(main);

const openAQBaseURL = 'https://api.openaq.org/v2/measurements';

async function fetchAirQualityData(url) {
    const response = await fetch(url);
    return response.json();
}

function drawChart(chartId, data, options) {
    const chart = new google.visualization.LineChart(document.getElementById(chartId));
    chart.draw(data, options);
}

function prepareCountryComparisonData(indiaData, usData) {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'India AQI');
    data.addColumn('number', 'US AQI');

    const indiaAQI = indiaData.results.map(entry => ({
        date: new Date(entry.date.utc).toLocaleDateString(),
        value: entry.value
    }));

    const usAQI = usData.results.map(entry => ({
        date: new Date(entry.date.utc).toLocaleDateString(),
        value: entry.value
    }));

    indiaAQI.forEach((indiaEntry, index) => {
        const usEntry = usAQI[index] || {};
        data.addRow([indiaEntry.date, indiaEntry.value, usEntry.value || null]);
    });

    return data;
}

function prepareIndiaAirQualityData(indiaMonthlyData) {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'AQI');

    indiaMonthlyData.results.forEach(entry => {
        data.addRow([new Date(entry.date.utc).toLocaleDateString(), entry.value]);
    });

    return data;
}

async function main() {
    try {
        const indiaData = await fetchAirQualityData(`${openAQBaseURL}?country=IN&limit=1000`);
        const usData = await fetchAirQualityData(`${openAQBaseURL}?country=US&limit=1000`);
        const indiaMonthlyData = await fetchAirQualityData(`${openAQBaseURL}?country=IN&date_from=2023-07-01&date_to=2023-07-31&limit=1000`);

        const countryComparisonData = prepareCountryComparisonData(indiaData, usData);
        const indiaAirQualityData = prepareIndiaAirQualityData(indiaMonthlyData);

        const countryComparisonOptions = {
            title: 'Air Quality Comparison between India and US',
            hAxis: { title: 'Date' },
            vAxis: { title: 'AQI' },
            legend: { position: 'bottom' }
        };

        const indiaAirQualityOptions = {
            title: 'India Air Quality (Past Month)',
            hAxis: { title: 'Date' },
            vAxis: { title: 'AQI' },
            legend: { position: 'bottom' }
        };

        drawChart('countryComparisonChart', countryComparisonData, countryComparisonOptions);
        drawChart('indiaAirQualityChart', indiaAirQualityData, indiaAirQualityOptions);
    } catch (error) {
        console.error('Error fetching or processing data', error);
    }
}
