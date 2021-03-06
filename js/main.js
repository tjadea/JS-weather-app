$(document).ready(function(){
    // Search for a Locations CURRENT Weather
    $('#searchWeather').on('click', function(){
        let city = $('#lookupLocation').val();
        if(city != '') {
            // Ajax request
            $.ajax({
                // Added cors to fix ''testing'' mixed content error
                url: 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric',
                headers: { 'Access-Control-Allow-Origin': '*' },
                type: 'GET',
                xhrFields: {
                    withCredentials: false
                },
                crossDomain: true,
                data: {
                    APPID: 'c83ca90630f86042a3cb11f3037af7e2'
                },
                success: function(data) {
                    // correct location submitted
                    let icon = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
                    $('#weather').html(`
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h3>${data.name} <span class="badge badge-secondary"> ${data.main.temp} &deg; C </span></h3>
                                    <h4> <span class="badge badge-warning">${data.main.temp_max} &deg; C</span> <span class="badge badge-info">${data.main.temp_min} &deg; C</span> </h4>
                                    <img src="${icon}"><br>
                                    <em> ${data.weather[0].description} </em>
                                    <h6>Co-ords: ${data.coord.lon} longitude &amp; ${data.coord.lat} latitude </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
                },
                error: function(data) {
                    // Something happened (like incorrect location)
                    $('#error').html('An error has occured, please input a valid location');
                }
            });
        } else {
            // Error has occured because field is blank
            $('#error').html('Field cannot be empty!');
        }
    });
    // Search for 5 day / 3 hour forecast data
    $('#searchForecast').on('click', function(){
        // number of results to display
        let results = 5;
        let city = $('#lookupLocation').val();
        if(city != '') {
            // Ajax request
            $.ajax({
                // Added cors to fix ''testing'' mixed content error
                url: 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric' + '&cnt=' + results,
                headers: { 'Access-Control-Allow-Origin': '*' },
                xhrFields: {
                    withCredentials: false
                },
                crossDomain: true,
                type: 'GET',
                data: {
                    APPID: 'c83ca90630f86042a3cb11f3037af7e2',
                },
                success: function(data) {
                    // correct location submitted
                    // console.log(data);
                    // if another function used then clear data
                    $('#weather').html('');
                    $.each(data, function() {
                        $.each(data.list, function(i) {
                            // console.log(i);
                            let unixTimestamp = data.list[i].dt;
                            let date = new Date(unixTimestamp*1000);
                            let icon = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png';
                
                            // Need to add a row in every 3 iterations
                            
                                    let contents = $(`
                                        <div class="card col-md-4">
                                            <div class="card-body">
                                                    <h3>${data.city.name} <span class="badge badge-secondary"> ${data.list[i].main.temp} &deg; C </span></h3>
                                                    <h6> ${date} </h6>
                                                    <h4> <span class="badge badge-warning">${data.list[i].main.temp_max} &deg; C</span> <span class="badge badge-info">${data.list[i].main.temp_min} &deg; C</span> </h4>
                                                    <img src="${icon}"><br>
                                                    <em> ${data.list[i].weather[0].description} </em>
                                                    <h6>Co-ords: ${data.city.coord.lon} longitude &amp; ${data.city.coord.lat} latitude </h6>
                                            </div>
                                        </div>
                                    `).appendTo('#weather');
                            });
            });
            // Group div's in three's and add .row div.
                    var divs = $("div#weather > div");
                    for(var i = 0; i < divs.length; i+=3) {
                    divs.slice(i, i+3).wrapAll(`
                    <div class='row'>
                    </div>`);
                }
                },
                error: function(data) {
                    // Something happened (like incorrect location)
                    $('#error').html('An error has occured, please input a valid location');
                }
            });
        } else {
            // Error has occured because field is blank
            $('#error').html('Field cannot be empty!');
        }
    });
    // Geolocate current location and display data {Using GEOIP}
    $("#currentLocation").click(function () {
        let city = '';
        $.ajax({
            url: "https://geoip-db.com/jsonp",
            jsonpCallback: "callback",
            dataType: "jsonp",
            success: function( location ) {
                let city = location.city;
                $('#lookupLocation').val(city);
                // console.log(city);
                // Ajax request
                $.ajax({
                    // Added cors to fix ''testing'' mixed content error
                    url: 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    type: 'GET',
                    xhrFields: {
                        withCredentials: false
                    },
                    crossDomain: true,
                    data: {
                        APPID: 'c83ca90630f86042a3cb11f3037af7e2'
                    },
                    success: function(data) {
                        // correct location submitted
                        let icon = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
                        $('#error').html('');
                        $('#weather').html(`
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h3>${data.name} <span class="badge badge-secondary"> ${data.main.temp} &deg; C </span></h3>
                                        <h4> <span class="badge badge-warning">${data.main.temp_max} &deg; C</span> <span class="badge badge-info">${data.main.temp_min} &deg; C</span> </h4>
                                        <img src="${icon}"><br>
                                        <em> ${data.weather[0].description} </em>
                                        <h6>Co-ords: ${data.coord.lon} longitude &amp; ${data.coord.lat} latitude </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `);
                    },
                    error: function(data) {
                        // Something happened (like incorrect location)
                        $('#error').html('An error has occured, please input a valid location');
                    }
                });  
            }
        });
    });

    // List Weather for X # of Locations

    // Allow field autocompletion when serching for weather
});