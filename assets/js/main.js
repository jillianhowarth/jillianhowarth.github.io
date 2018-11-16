/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1141px',  '1680px' ],
			large:    [ '981px',   '1140px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '321px',   '480px'  ],
			xxsmall:  [ null,      '320px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

})(jQuery);



//determine API URLS
var wioNodes = ["https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=aeebbcf10d2f75a26ce9eb5925576b91", "https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=e1c2fa59156ad7c7b78ee5873f2a4cab", "https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=1eb6cf3de0641d1d95c4f0da5ea0ce26", "https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=67f7830f6026b4e04cad102472b669a1", "https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=81574af7aeae678e43c58213288f4aec", "https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=138e0a478f276ea4b642b6642315782e", "https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=7d636d3d891b2ae545c6da21831d719b", "https://us.wio.seeed.io/v1/node/GroveLuminanceA0/luminance?access_token=26b659475677eef763ec35fe4b3e41f4"]

var wioButtons = ["aeebbcf10d2f75a26ce9eb5925576b91", "e1c2fa59156ad7c7b78ee5873f2a4cab", "1eb6cf3de0641d1d95c4f0da5ea0ce26", "67f7830f6026b4e04cad102472b669a1", "81574af7aeae678e43c58213288f4aec", "138e0a478f276ea4b642b6642315782e", "7d636d3d891b2ae545c6da21831d719b", "26b659475677eef763ec35fe4b3e41f4"]
//var nodeSound;
//var nodeLight;



//start/stop button setup
var continueCollectData = true;
var locationAsynch;
var myVar;

function myTimer() {
    asychCheck = collectData(locationAsynch);
			if(continueCollectData == false){
				console.log("false!");
			}
	};

function startDataCollection() {

	continueCollectData = true;
	var locationAsynch = submitLocationData();
		/*var intervalId = window.setInterval(function(){
			var asychCheck = collectData(locationAsynch);
			if(continueCollectData == false){
				console.log("false!");
				return;
				window.clearInterval(intervalId);
			}
		}, 1000);*/

	myVar = setInterval(myTimer, 1000);
}


function stopCollection(){
	continueCollectData = false;
	clearInterval(myVar);
}


//building data
var locationData = {
			buildingLocation: "", 
			studySpot: "", 
			dataCollector: "",
			nodeSound: "",
			nodeLight: "",
			nodeButton: "",
		};

		function submitLocationData()
        {
            locationData.buildingLocation = document.getElementById("demo-building").value;
            locationData.studySpot = document.getElementById("form-studySpot").value;
            locationData.dataCollector = document.getElementById("form-name").value;
            nodeSound = wioNodes[document.getElementById("demo-sound-sensor").value-1];
            nodeLight = wioNodes[document.getElementById("demo-light-sensor").value-1];
            return(locationData);
        }




		//data api collection
		
		//#1
		var tableString = "";
		var ws = new WebSocket('wss://us.wio.seeed.io/v1/node/event');
		
		//button collection
		//ROWS: date | time | Building | Study Spot | Collector
		ws.onopen = function() {
    		ws.send("7d636d3d891b2ae545c6da21831d719b");
		};
		ws.onmessage = function (evt) {
			var d = new Date();
			var date = d.toLocaleString();
    		//alert(evt.data);
    		//console.log(date);
    		if(evt.data == "\{\"error\"\: \"node is offline\"\}"){
    			alert("Node is offline! Plug it in and try again.")
    		}
    		console.log(evt.data);
    		tableString = tableString + date + "<br>";
    		document.getElementById("ButtonData").innerHTML = tableString;
		};


		var xhttp = new XMLHttpRequest();
		


		//sound and light collection
		//ROWS: sound level | light level | date | time | Building | Study Spot | Collector
		var soundTable = "";


	function collectData(asynchCheck){
			//window.setInterval(function(){
			var soundLvl = "";
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			       // Typical action to be performed when the document is ready:
			        var response = xhttp.responseText;
			        //console.log("ok"+response);
			        var sound_length = response.length - 1;
			        for (var i = 16; i < sound_length; i++) { 
	    				soundLvl = soundLvl + response[i];
					}

					var d = new Date();
					var date = d.toLocaleString();
					console.log("LightRow: " + collectLightData());
					soundTable = soundTable + soundLvl + ", " + date + ", " + locationData.buildingLocation + ", " + locationData.studySpot + ", " + locationData.dataCollector + "<br>";
			        document.getElementById("SoundData").innerHTML = soundTable;
			    }
			};
			
			xhttp.open("GET", nodeSound, true);
			xhttp.send();
			//}, 1000);
		//console.log("Sound!");
		//collectLightData(xhttp.onreadystatechange);
		return;
	};


	var lightTable = "";
	function collectLightData(){
			//window.setInterval(function(){
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			       // Typical action to be performed when the document is ready:
			        var response = xhttp.responseText;
			        //console.log("ok"+response);
			        var light_length = response.length - 1;
			        var lightLvl = "";
			        for (var i = 8; i < light_length; i++) { 
	    				lightLvl = lightLvl + response[i];
					}

					var d = new Date();
					var date = d.toLocaleString();
					lightTable = lightTable + lightLvl + ", " + date + ", " + locationData.buildingLocation + ", " + locationData.studySpot + ", " + locationData.dataCollector + "<br>";
			        document.getElementById("LightData").innerHTML = lightTable;
			    }
			};
			
			xhttp.open("GET", nodeLight, true);
			xhttp.send();
			//}, 1000);
		//console.log("Light! " + lightTable);
		return (lightTable);
	};





