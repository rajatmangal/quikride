        var map;
        var pickUpMarker;
        var dropOffMarker;

        function updateMarkers(pickUpLat, pickUpLng, dropOffLat, dropOffLng) {
            var pickUpPosition = {lat: parseFloat(pickUpLat), lng: parseFloat(pickUpLng)};
            var dropOffPosition = {lat: parseFloat(dropOffLat), lng: parseFloat(dropOffLng)};
            pickUpMarker.setPosition(pickUpPosition);
            dropOffMarker.setPosition(dropOffPosition);
        }
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 49.17, lng: -122.87},
            zoom: 12
            });
            infoWindow = new google.maps.InfoWindow;

            // markers will be added in the future from database
            var myLatLng = {lat: 49.17, lng: -122.87};

            pickUpMarker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Pickup'
            });

            dropOffMarker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Dropoff'
            });

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                };
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
            } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
            }
            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                                    'Error: The Geolocation service failed.' :
                                    'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
            }

          //To turn google place api on, replace the API key at the bottom and uncomment these 2 lines
          var pickup = document.getElementById('pickUp');
          var dropoff = document.getElementById('dropOff');
  
          var autocomplete = new google.maps.places.Autocomplete(pickup);
          var autocomplete2 = new google.maps.places.Autocomplete(dropoff);
  
          // Bind the map's bounds (viewport) property to the autocomplete object,
          // so that the autocomplete requests use the current map bounds for the
          // bounds option in the request.
  
          // Set the data fields to return when the user selects a place.
          autocomplete.setFields(
              ['address_components', 'geometry', 'icon', 'name']);
  
          autocomplete.addListener('place_changed', function() {

            var place = autocomplete.getPlace();
            if (!place.geometry) {
              window.alert("No details available for input: '" + place.name + "'");
              return;
            } else {
              document.getElementById('pickUpLocationLat').value = place.geometry.location.lat();
              document.getElementById('pickUpLocationLng').value = place.geometry.location.lng();
            }
            
          });
          autocomplete2.setFields(
              ['address_components', 'geometry', 'icon', 'name']);
  
          autocomplete2.addListener('place_changed', function() {

            var place = autocomplete2.getPlace();
            if (!place.geometry) {
              window.alert("No details available for input: '" + place.name + "'");
              return;
            } else {
              document.getElementById('dropOffLocationLat').value = place.geometry.location.lat();
              document.getElementById('dropOffLocationLng').value = place.geometry.location.lng();
            }
            
          });

        }