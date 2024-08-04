async function AQData(url) {
  const response = await fetch(url);
  return response.json();
}

async function main() {
  try {
    // Fetch data
    const indiaData = await AQData(
      "https://api.openaq.org/v2/measurements?country=IN&limit=1000"
    );
    const usData = await AQData(
      "https://api.openaq.org/v2/measurements?country=US&limit=1000"
    );
    const indiaMonthly = await AQData(
      "https://api.openaq.org/v2/measurements?country=IN&date_from=2023-07-01&date_to=2023-07-31&limit=1000"
    );

    // console.log(indiaData);
    // console.log(usData);
    // console.log(indiaMonthly);

    // average AQ for the comparision
    let count = 0;
    const avgIndia =
      indiaData.results.reduce((sum, val) => {
        if (val.value <= -500) {
          count = count + 1;
          return sum;
        } else {
          return sum + val.value;
        }
      }, 0) /
      (indiaData.results.length - count);
      console.log(count);
      
    const avgUs =
      usData.results.reduce((sum, val) => sum + val.value, 0) /
      usData.results.length;

    const countryLabels = ["India", "US"];
    const countryData = [avgIndia, avgUs];

    const indiaLabels = indiaMonthly.results.map((val) =>
      new Date(val.date.utc).toLocaleDateString()
    );
    const indiaAirQualityData = indiaMonthly.results.map(
      (val) => val.value
    );

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

    // cahrt for india(date wise)
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
