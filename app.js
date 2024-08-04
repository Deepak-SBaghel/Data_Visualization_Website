async function AQData(url) {
  const response = await fetch(url);
  return response.json();
}

async function main() {
  try {
<<<<<<< HEAD
=======
    // Fetch
>>>>>>> 4af2008d025135c3b3a1adc410bd89e84e800a6d
    const indiaData = await AQData(
      "https://api.openaq.org/v2/measurements?country=IN&limit=1000"
    );
    const usData = await AQData(
      "https://api.openaq.org/v2/measurements?country=US&limit=1000"
    );
    const indiaMonthly = await AQData(
<<<<<<< HEAD
      "https://api.openaq.org/v2/measurements?country=IN&date_from=2024-07-02&date_to=2024-08-02&limit=1000"
=======
      "https://api.openaq.org/v2/measurements?country=IN&date_from=2024-07-01&date_to=2024-07-31&limit=1000"
>>>>>>> 4af2008d025135c3b3a1adc410bd89e84e800a6d
    );

    // console.log(indiaData);
    // console.log(usData);
    // console.log(indiaMonthly);

<<<<<<< HEAD
    // average AQ for the comparision(country wise)
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

    // console.log(count);
    const avgUs =
      usData.results.reduce((sum, val) => sum + val.value, 0) /usData.results.length;
=======
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
>>>>>>> 4af2008d025135c3b3a1adc410bd89e84e800a6d

    const countryLabels = ["India", "US"];
    const countryData = [avgIndia, avgUs];

<<<<<<< HEAD
    let repdate = indiaMonthly.results[0].date.utc.slice(8, 10); // taking date part
    const indiaLabels = indiaMonthly.results // for making label date wise
      .filter((val) => {
        let date = val.date.utc.slice(8, 10);
        if (date != repdate) {
          repdate = date;
          return true;
        } else {
          return false;
        }
      })
      .map((val) => {
        // console.log(val);
        return new Date(val.date.utc).toLocaleDateString();
      });
=======
    const indiaLabels = indiaMonthly.results
      .map((val) => new Date(val.date.utc).toLocaleDateString())
      .filter((val, index) => indiaMonthly.results[index].value >= 0);
    const indiaAirQualityData = indiaMonthly.results
      .map((val) => val.value)
      .filter((val) => val >= 0);
>>>>>>> 4af2008d025135c3b3a1adc410bd89e84e800a6d

    repdate = indiaMonthly.results[0].date.utc.slice(8, 10);
    let sum = 0;
    let counte = 0;
    let indata = {}
    console.log(indiaMonthly);
      
    const indiaAirQualityData = indiaMonthly.results
    .filter((val) => {
        let date = val.date.utc.slice(8, 10);
        if (date == repdate) {
          count+=1;
          sum += val.value;
          repdate = date;
        } else {
            indata[date]
          sum = 0;
        }
      })
      .map((val) => {
        if (val.value <= -900) {
          return 0;
        } else {
          return val.value;
        }
      });

    console.log(indiaAirQualityData);
    

    // chart for the (in vs us)
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
