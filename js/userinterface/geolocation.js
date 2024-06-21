var explaincomponent_options = {
    componentName: 'Geolocation'
};

var geoloc_example1_options = {
    onLocateFunctions: [
      function(position){
          alert("position recived. See javascript console for more information");
          console.log(position);
      }  
    ]
};

// Example 2
document.addEventListener('swac_geoloc_example1_geolocation_newlocation',function(e) {
    console.log('New geolocation recived: ', e.detail.position);
    console.log('New geolocations address: ', e.detail.address);
});