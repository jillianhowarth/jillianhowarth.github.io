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





//start/stop button setup
var continueCollectData = false;

function startDataCollection() {
	continueCollectData = true;
	var locationAsynch = submitLocationData();
	collectData(locationAsynch);
	//console.log(locationAsynch);
}

function stopDataCollection(){
	continueCollectData = false;
}



//building data
var locationData = {
			buildingLocation: "", 
			studySpot: "", 
			dataCollector: ""
		};

		function submitLocationData()
        {
            locationData.buildingLocation = document.getElementById("demo-building").value;
            locationData.studySpot = document.getElementById("form-studySpot").value;
            locationData.dataCollector = document.getElementById("form-name").value;
            //console.log(locationData);
            return(locationData);
        }




		//data api collection
		
		var tableString = "";
		var ws = new WebSocket('wss://us.wio.seeed.io/v1/node/event');
		
		//button collection
		//ROWS: date | time | Building | Study Spot | Collector
		ws.onopen = function() {
    		ws.send("aeebbcf10d2f75a26ce9eb5925576b91");
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
			window.setInterval(function(){
			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			       // Typical action to be performed when the document is ready:
			        var response = xhttp.responseText;
			        //console.log("ok"+response);
			        var sound_length = response.length - 1;
			        var soundLvl = "";
			        for (var i = 16; i < sound_length; i++) { 
	    				soundLvl = soundLvl + response[i];
					}

					var d = new Date();
					var date = d.toLocaleString();
					soundTable = soundTable + soundLvl + ", " + date + ", " + locationData.buildingLocation + ", " + locationData.studySpot + ", " + locationData.dataCollector + "<br>";
			        document.getElementById("SoundLightData").innerHTML = soundTable;
			    }
			    else {
			    	alert("Oh no! Something went wrong. Double check the node is plugged in and online. (also close this page before starting over because this alert is gonna keep showing up and will get v annoying but I don't know how to stop that - Jillian)")
			    }
			};
			
			xhttp.open("GET", "https://us.wio.seeed.io/v1/node/GroveSoundA0/sound_level?access_token=aeebbcf10d2f75a26ce9eb5925576b91", true);
			xhttp.send();
			}, 5000);

	};





