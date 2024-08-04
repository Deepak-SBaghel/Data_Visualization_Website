async function AQData(url) {
  const response = await fetch(url);
  return response.json();
}

async function main() {
  try {
    // Fetch
    const indiaData = await AQData(
      "https://api.openaq.org/v2/measurements?country=IN&limit=1000"
    );
    const usData = await AQData(
      "https://api.openaq.org/v2/measurements?country=US&limit=1000"
    );
    const indiaMonthly = await AQData(
      "https://api.openaq.org/v2/measurements?country=IN&date_from=2024-07-01&date_to=2024-07-31&limit=1000"
    );

    console.log(indiaData);
    console.log(usData);
    console.log(indiaMonthly);

    const validIndiaValues = indiaData.results
      .map((val) => val.value)
      .filter((val) => val >= 0);
    const avgIndia =
      validIndiaValues.reduce((sum, val) => sum + val, 0) /
      validIndiaValues.length;

    const validUsValues = usData.results
      .map((val) => val.value)
      .filter((val) => val >= 0);
    const avgUs =
      validUsValues.reduce((sum, val) => sum + val, 0) / validUsValues.length;

    const countryLabels = ["India", "US"];
    const countryData = [avgIndia, avgUs];

    const indiaLabels = indiaMonthly.results
      .map((val) => new Date(val.date.utc).toLocaleDateString())
      .filter((val, index) => indiaMonthly.results[index].value >= 0);
    const indiaAirQualityData = indiaMonthly.results
      .map((val) => val.value)
      .filter((val) => val >= 0);

    // Create charts
    new Chart(
      document.getElementById("countryComparisonChart").getContext("2d"),
      {
        type: "bar",
        data: {
          labels: countryLabels,
          datasets: [
            {
              label: "Average AQI",
              data: countryData,
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          },
        },
      }
    );

    new Chart(
      document.getElementById("indiaAirQualityChart").getContext("2d"),
      {
        type: "line",
        data: {
          labels: indiaLabels,
          datasets: [
            {
              label: "AQI",
              data: indiaAirQualityData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          },
        },
      }
    );

    document.querySelector("h1").classList.add("slide-in");
    document.querySelectorAll("h2").forEach((h2) => h2.classList.add("slide-in"));
  } catch (error) {
    console.error("Error fetching or processing data", error);
  }
}

main();
