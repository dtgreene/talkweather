import React, { useEffect, useState, useRef } from 'react';

const placeholderTime = 2000;

export const App = () => {
	const {
		placeholder: tomorrowCondition,
		setPlaceholder: setTomorrowCondition
	} = usePlaceholder('uhhhhhh');

	const {
		placeholder: conditionLocation,
		setPlaceholder: setConditionLocation
	} = usePlaceholder('uhhhhhh');

	const [error, setError] = useState(null);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async position => {
				const { latitude, longitude } = position.coords;
				try {
					const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}&days=2&aqi=no&alerts=no`);
					const data = await res.json();

					setTomorrowCondition(data.forecast.forecastday[1].day.condition.text);
					setConditionLocation(data.location.region);
				} catch(e) {
					console.error(`Failed to fetch weather data\n${e}`);
					setError('Failed to get weather data');
				}
			}, () => {
				console.error('Geolocation failed to get location');
				setError('There was a problem getting the location');
			});
		} else {
			console.error('Geolocation not supported');
			setError('Geolocation not supported in this browser');
		}
	}, []);

	return (
		<div className="container text-center">
			<div className="h1 mt-5 text-gray">
				You hear about that weather?
			</div>
			<div className="h1 mt-5">
				I hear conditions tomorrow are gonna be <b>{tomorrowCondition}</b> in <b>{conditionLocation}</b>.
			</div>
			{error && (
				<div className="text-danger">
					({error})
				</div>
			)}
		</div>
	);
};

function usePlaceholder(defaultValue) {
	const [placeholder, _setPlaceholder] = useState(defaultValue);
	const dataRef = useRef({
		timePassed: false,
		placeholder: defaultValue
	});

	const setPlaceholder = (value) => {
		dataRef.current.placeholder = value;
		if(dataRef.current.timePassed) {
			_setPlaceholder(value);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			if(dataRef.current.placeholder) {
				_setPlaceholder(dataRef.current.placeholder);
			}
			dataRef.current.timePassed = true;
		}, placeholderTime);
	}, []);

	return {
		placeholder,
		setPlaceholder
	};
}
