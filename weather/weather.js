document.getElementById('poisk-btn').addEventListener('click', () => {
    const gorod = document.getElementById('poisk-gorod').value;
    if (gorod) {
        poluchitDannyePogody(gorod);
    } else {
        alert("Please enter a city name.");
    }
});

async function poluchitDannyePogody(gorod) {
    const apiKey = 'bcba85ba36a40d73908b75186156c8ed';
    const pogodaURL = `https://api.openweathermap.org/data/2.5/weather?q=${gorod}&units=metric&appid=${apiKey}`;
    const prognozURL = `https://api.openweathermap.org/data/2.5/forecast?q=${gorod}&units=metric&appid=${apiKey}`;

    try {
        const otvetPogoda = await fetch(pogodaURL);
        const dannyePogoda = await otvetPogoda.json();

        if (dannyePogoda.cod !== 200) {
            alert("City not found. Please try again.");
            return;
        }

        otobrozhatPogodu(dannyePogoda);

        const otvetPrognoz = await fetch(prognozURL);
        const dannyePrognoz = await otvetPrognoz.json();
        otobrozhatPrognoz(dannyePrognoz);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function otobrozhatPogodu(dannye) {
    document.getElementById('gorod-name').innerText = dannye.name;
    document.getElementById('data').innerText = new Date().toDateString();
    document.getElementById('temperatura').innerText = `${dannye.main.temp.toFixed(1)}°C`;
    document.getElementById('opisanie-pogody').innerText = dannye.weather[0].description;
    document.getElementById('vlazhnost').innerText = dannye.main.humidity;
    document.getElementById('skorost-vetra').innerText = dannye.wind.speed;

    document.getElementById('pogoda-info').style.display = 'block';
}

function otobrozhatPrognoz(dannye) {
    const prognozContainer = document.getElementById('prognoz');
    prognozContainer.innerHTML = '';

    const spisokPrognoza = dannye.list.filter((_, index) => index % 8 === 0).slice(1, 6);
    spisokPrognoza.forEach(prognoz => {
        const den = new Date(prognoz.dt * 1000);
        const imyaDnya = den.toLocaleDateString("en-US", { weekday: 'short' });
        const ikonkaPogody = prognoz.weather[0].icon;
        const tempMax = prognoz.main.temp_max.toFixed(1);
        const tempMin = prognoz.main.temp_min.toFixed(1);

        const prognozDen = document.createElement('div');
        prognozDen.classList.add('prognoz-day');
        prognozDen.innerHTML = `
            <p>${imyaDnya}</p>
            <img src="http://openweathermap.org/img/wn/${ikonkaPogody}.png" alt="${prognoz.weather[0].description}">
            <p>${tempMax}° / ${tempMin}°</p>
        `;

        prognozContainer.appendChild(prognozDen);
    });
}
