const wrapper = document.querySelector('.wrapper'),
	inputPart = wrapper.querySelector('.input-part'),
	infoTxt = inputPart.querySelector('.info-txt'),
	inputField = inputPart.querySelector('input'),
	locationBtn = inputPart.querySelector('button'),
	wIcon = wrapper.querySelector('.weather-part img'),
	arrowBack = wrapper.querySelector('header i');

const ApiKey=config.APIKEY;
let api;

inputField.addEventListener('keyup', (e) => {
	//if user pressed enter btn and i/p value is not empty
	if (e.key == 'Enter' && inputField.value !== '') {
		requestApi(inputField.value);
	}
});

locationBtn.addEventListener('click', () => {
	if (navigator.geolocation) {
		//if browser supports geolocation API
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	} else {
		alert("Your browser doesn't supports geolocation API");
	}
});

function onSuccess(position) {
	const { latitude, longitude } = position.coords; // getting latitude and longitude of the user device from coords object
	api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${ApiKey}`;
	fetchData();
}

function onError(error) {
	infoTxt.innerText = error.message;
	infoTxt.classList.add('error');
}

function requestApi(city) {
	api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`;
	fetchData();
}

function fetchData() {
	infoTxt.innerText = 'Getting weather details...';
	infoTxt.classList.add('pending');
	//Getting API response and returning it with parsing into JS Object and in another
	//then function calling weatherDetails func with passing API result as an argument
	fetch(api)
		.then((response) => response.json())
		.then((result) => weatherDetails(result));
}

function weatherDetails(info) {
	if (info.cod == '404') {
		infoTxt.classList.replace('pending', 'error');
		infoTxt.innerText = `${inputField.value} isn't a valid city name`;
	} else {
		// getting required properties value from the info object
		const city = info.name;
		const country = info.sys.country;
		const { description, id } = info.weather[0];
		const { feels_like, humidity, temp } = info.main;

		//using custom icon according to the id which API returns
		if (id == 800) {
			wIcon.src = 'Icons/clear.svg';
		} else if (id >= 200 && id <= 232) {
			wIcon.src = 'Icons/storm.svg';
		} else if (id >= 600 && id <= 622) {
			wIcon.src = 'Icons/snow.svg';
		} else if (id >= 701 && id <= 781) {
			wIcon.src = 'Icons/haze.svg';
		} else if (id >= 801 && id <= 804) {
			wIcon.src = 'Icons/cloud.svg';
		} else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
			wIcon.src = 'Icons/rain.svg';
		}

		//passing these values to a particular HTML Element
		wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
		wrapper.querySelector('.weather').innerText = description;
		wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
		wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
		wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

		infoTxt.classList.remove('pending', 'error');
		wrapper.classList.add('active');
		// console.log(info);
	}
}

arrowBack.addEventListener('click', () => {
	wrapper.classList.remove('active');
});
