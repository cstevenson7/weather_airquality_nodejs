const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    //this has to be a let here because we might
    //change the data  in the if statement
    let txt = `The weather here at ${item.lat}&deg;,
    ${item.lon}&deg;  ${item.weather.name} has
    a temperature of ${item.weather.main.temp}&deg; C
    and the current conditions are ${item.weather.weather[0].description}. `;

    if (item.air.value < 0) {
      txt += '  No air quality reading.';
    } else {
      txt += `  The concentration of particulate matter 
    (${item.air.parameter}) is ${item.air.value} 
    ${item.air.unit} last read on ${item.air.lastUpdated}`;
    }
    //putting text in the marker bindPopup using the  Leaflet function
    marker.bindPopup(txt);
  }
    console.log(data);
};

