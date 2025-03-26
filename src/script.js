        const apiKey = "fb326f256bd7f14776b90d44c2ae6561";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

        // DOM Elements
        const searchInput = document.getElementById('location-search');
        const searchBtn = document.getElementById('search-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const resultsContainer = document.getElementById('search-results');

        // Weather display elements
        const cityName = document.getElementById('city-name');
        const updateTime = document.getElementById('update-time');
        const weatherIcon = document.getElementById('weather-icon');
        const temperature = document.getElementById('temperature');
        const weatherDescription = document.getElementById('weather-description');
        const tempMax = document.getElementById('temp-max');
        const tempMin = document.getElementById('temp-min');
        const currentDate = document.getElementById('current-date');
        const precipitation = document.getElementById('precipitation');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('wind-speed');
        const feelsLike = document.getElementById('feels-like');

        // Initial load with default city
        checkWeather("Jos");

        // Search functionality
        searchBtn.addEventListener('click', () => {
            const city = searchInput.value.trim();
            if (city) {
                checkWeather(city);
                searchInput.value = "";
                resultsContainer.classList.add('hidden');
            }
        });

        // Refresh functionality
        refreshBtn.addEventListener('click', () => {
            const currentCity = cityName.textContent.split(",")[0];
            checkWeather(currentCity);
        });

        // Enter key press in search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = searchInput.value.trim();
                if (city) {
                    checkWeather(city);
                    searchInput.value = "";
                    resultsContainer.classList.add('hidden');
                }
            }
        });

        // Check weather function
        async function checkWeather(city) {
            try {
                const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
                if (!response.ok) {
                    throw new Error('City not found');
                }
                const data = await response.json();

                // Update weather data
                cityName.textContent = `${data.name}, ${data.sys.country}`;
                temperature.textContent = Math.round(data.main.temp);
                tempMax.textContent = `${Math.round(data.main.temp_max)}°`;
                tempMin.textContent = `${Math.round(data.main.temp_min)}°`;
                weatherDescription.textContent = data.weather[0].description;
                humidity.textContent = `${data.main.humidity}%`;
                windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
                feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;

                // Set precipitation (OpenWeatherMap doesn't provide this in current weather)
                precipitation.textContent = "0%";

                // Set weather icon
                const iconCode = data.weather[0].icon;
                weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}">`;

                // Update time
                const now = new Date();
                updateTime.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Updated at ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}
                `;

                // Update date
                currentDate.textContent = formatDate(now);

            } catch (error) {
                alert("Error fetching weather data: " + error.message);
            }
        }

        // Format date helper
        function formatDate(date) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            const dayName = days[date.getDay()];
            const monthName = months[date.getMonth()];
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${dayName}, ${monthName} ${day} • ${hours}:${minutes}`;
        }