//to get access to express you need a require statement
const express = require('express');

//need access to neDB
const Datastore = require('nedb');
const fetch = require('node-fetch');

// this tells this server to load anythin in the .env file
// as a  environment variable
require('dotenv').config();

//everything the .env
console.log(process.env)

// we need this to create an  web application, we do that
// by using the express function. That whole  Express library
// basically comes in as a whole function
 const app = express();

//first thing you need to do is get the web server listening
// port is a numeric address that you want to listen on
//the () is a callback function
app.listen(3000, () => console.log('server listening at 3000'));

//using express to host the static files
//anyhing in the public folder is accessible to the public,
// he uses that name to remind himself of this fact
//now we are serving up a webpage... the index.html
app.use(express.static('public'));

//need this so the server can understand incoming requests as JSON
//the options are to limit what we can recieve as data. This
//protects against someone flooding my server with data
app.use(express.json({limit: '1mb'}))


//an array to store the lat &lon when the submit button is  clicked
//const database = [];
//now creating a datastore instead of just an array and giving it a path
//for where to store the data
const database = new Datastore('database.db');

//this will add any data from the last server run, if server has never run nothing shows up
database.loadDatabase();
//testing the database - NEED TO RESTART SERVER  it adds a unique_id
// database.insert({name: 'Cindy', status: 'SoSo'})
// database.insert({name: 'Katie', status: 'Awesome'})

// These are ROUTEs

app.get('/api', (request,response) => {
    //to test that the get is working
    //response.json({ test: 123 });
   //find has a empty array (for any data) for all the data and a callbacl with
   //two arguments - err and data
    database.find({},(err,data) => {
        if (err) {
            //basically quit the function
             response.end();
             return;
        }
        response.json(data);
   });
});

//specify get or post , need address where I want to receive this post
//and a callback function where i am going to look at the information
// coming in and send a response back
//endpoint where I going to recieve this info is: /api
// we are setting up an API for clients to send data to me.
//request - this variable holds all the data about  the information contained in this request,
//            i.e. data that is being sent and any information i need to know about this particular
//            client that is sending the request
//response - is the variable I can use to send things back to the client
//SENDING DATA TO DATABASE
app.post('/api', (request,response) => {
    //lets see what the request looks like
    //this shows up in the terminal, not in the client side
    //browser console 
    //console.log(request);
    // to just see the body of the request
    //
    console.log("Woohoo, I got a request")
    //this will display on object with lat and lon
    //console.log(request.body);
    const data = request.body;
    //adding lat + lon to database array
    //database.push(data);
    //adding JavaScript Date().now timestamp
    const timestamp = Date.now()
    //addinfg the timestamp to the lat & lon from the request.body
    data.timestamp = timestamp;
    database.insert(data);
    //console.log(database);
    //send a response back to the client, an object with some data
    //have to do something in the client to recieve the response back
    //response comes back after a fetch call as a data stream. So it is up to you
    //to define how you want to read it ( text, blob(image), json, etc). 
    //I want json and I have to handle this in the client.
    // response.json({
    //     status:'success',
    //     timestamp:timestamp,
    //     climber: data.climber,
    //     latitude: data.lat,
    //     longitude: data.lon

    // });
    //2.5 simplifying the response - took the request body and inserted that into the database, 
    //so the request comes in I add the timestamp to the that object and I insert that into the database
    //and send everything back to the client
    response.json(data);
});


//making the new weather route aka endpoint for a get request,
//with route parameters. so sending in the lat and lon seperated by a comma
//see  line 57 in client js
app.get('/weather/:latlon', async (request,response) => {
    console.log(request.params);
    //turn ir into an array with the split function
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    //console.log(latlon[0], latlon[1]);
    //making the api call to OpenWeather from the server instead of the client, and then send it back 
    
    const api_key = process.env.API_KEY ;
    const weather_api_url = `http://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(latlon[0])}&lon=${parseFloat(latlon[1])}&units=metric&appid=${api_key}`
    const weather_response = await fetch(weather_api_url);
    const weather_json = await weather_response.json();
    //console.log(`Weather json from the server: ${JSON.stringify(weather_json)}`);
    //now to add another API call, just repeat the three lines above 


    //making the api call to OpenAQ from the server - no API key
    //const weather_api_url = `https://api.openaq.org/v1/latest?coordinates=51.03,-114.07`
    const airQuality_api_url = `https://api.openaq.org/v1/latest?coordinates=${parseFloat(latlon[0])},${parseFloat(latlon[1])}`
    const airQuality_response = await fetch(airQuality_api_url);
    const airQuality_json = await airQuality_response.json();
    //console.log(`Air Quality json from the server: ${JSON.stringify(airQuality_json)}`);

    const api_data = {
        weather: weather_json,
        airQuality: airQuality_json
    }

    response.json(api_data);

});
    

