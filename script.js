let weather = {
    apiKey: "b26b64fe55573a9147d64e3c97e0bc2f",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=metric&appid="
        + this.apiKey)
        .then((response) => response.json())
        .then((data) => {
            const { name } = data;
            const { country } = data.sys;
            this.fetchContinent(data, name, country);
        });
    },
    displayWeather: function(data, time, flag) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { country } = data.sys;
        let displayTemp = Math.round(temp * 10) / 10;
        document.querySelector(".city").innerText = "Weather in " + name + ", " + country + " at " 
        + time;
        document.querySelector(".flag").innerText = flag;
        document.querySelector(".temp").innerText = displayTemp + "°C";
        console.log(icon);
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = "Description: " + description;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " mph";
        document.querySelector(".weather").classList.remove("loading");
    },
    fetchTime: function(old_data, city, continent, flag) {
        fetch("http://worldtimeapi.org/api/timezone/"
        + continent + "/" + city)
        .then((response) => response.json())
        .then((data) => {
            const { utc_datetime } = data;
            let time = utc_datetime.substring(11,16);
            this.displayWeather(old_data, time, flag);
        })
        .catch(error => this.displayWeather(old_data, "N/A", flag))
    },
    fetchContinent: function(old_data, name, abbr) {
        fetch("https://restcountries.com/v3.1/name/" + abbr)
        .then((response) => response.json())
        .then((data) => {
            for (const element of data) {
                if (element["cca2"] == abbr) {
                    if (element["region"] == "Americas") {
                        this.fetchTime(old_data, name, "America", element["flag"]);
                    }
                    else {
                        this.fetchTime(old_data, name, element["region"], element["flag"]);
                    }
                    break;
                }
            }
        });
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
    clear: function() {
        document.getElementById("city").value = "";
    }
};

document.querySelector(".search button")
.addEventListener("click", function () {
    weather.search();
    weather.clear();
});
document.querySelector(".search-bar")
.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
        weather.clear();
    }
});
weather.fetchWeather("London");