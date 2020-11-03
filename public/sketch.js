
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    // CHanging things to even if there is no air quality data,
    // it will get added to the database by putting the saviving to the database after the "catch"
    let lat, lon, weather, air
    try{
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        lat = lat.toFixed(2);
        lon = lon.toFixed(2);
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;

        const weather_api_url = `weather/${lat}, ${lon}`
        //hard coding lat _ lon to test
        //const weather_api_url = `/weather`;
        const response = await fetch(weather_api_url);
        const api_json = await response.json();
        //console.log(api_json);
        //console.log(`From client both API's: ${JSON.stringify(api_json)}`);
        weather = api_json.weather
        air = api_json.airQuality.results[0].measurements[0];

        document.getElementById('city').textContent = weather.name;
        document.getElementById('temp').textContent = weather.main.temp;
        document.getElementById('conditions').textContent = weather.weather[0].description;
        document.getElementById('aq_parameter').textContent = air.parameter;
        document.getElementById('aq_value').textContent = air.value;
        document.getElementById('aq_units').textContent = air.unit;
        document.getElementById('aq_date').textContent = air.lastUpdated;

        // //sending everything to the server which will then send it to  
        // //database here after I have finished the API calls
        // const data = { lat, lon, weather, air};
        // const options = {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(data)
        // };
        // const db_response = await fetch('/api', options);
        // const db_json = await db_response.json();
        // //console.log(`This is what is heading to the database:  ${JSON.stringify(db_json)}`)

      } catch(error){
        console.log("Something went wrong")
        air = {value: -1};
        //better to do this
        document.getElementById('aq_value').textContent = 'NO DATA AVAILABLE';
      }

        //sending everything to the server which will then send it to  
        //database here after I have finished the API calls
        const data = { lat, lon, weather, air};
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        };
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();
        //console.log(`This is what is heading to the database:  ${JSON.stringify(db_json)}`)
  });
} else {
  console.log('geolocation not available');
}


