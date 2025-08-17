const apiKey = '71f2386d81ca335e53a9fa3e72b4818f'; // ✅ your actual API key

function getWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  // ✅ API URLs
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // ✅ Get current weather
  fetch(currentUrl)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const weatherCard = document.getElementById('weather-result');
      const { name } = data;
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const weatherDesc = data.weather[0].description;

      weatherCard.innerHTML = `
        <h2>${name}</h2>
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${speed} m/s</p>
        <p><strong>Condition:</strong> ${weatherDesc}</p>
      `;
      weatherCard.style.display = 'block';
    })
    .catch(error => alert(error.message));

  // ✅ Get 5-day forecast
  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) throw new Error("Forecast not available");
      return response.json();
    })
    .then(data => {
      const forecastContainer = document.getElementById('forecast');
      forecastContainer.innerHTML = '';

      // ✅ Filter for data around 12 PM each day
      const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      dailyData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = day.main.temp;
        const icon = day.weather[0].icon;
        const desc = day.weather[0].main;

        const forecastHTML = `
          <div class="forecast-day">
            <h4>${dayName}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
            <p>${temp.toFixed(1)} °C</p>
            <p>${desc}</p>
          </div>
        `;

        forecastContainer.innerHTML += forecastHTML;
      });
    })
    .catch(error => console.error(error));
}
