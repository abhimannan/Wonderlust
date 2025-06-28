
  
	mapboxgl.accessToken = mapToken;

  console.log("Listing received from EJS:", listing);

  const coordinates = listing.geometry.coordinates;
  const title = listing.title;

    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/standard',
        center: coordinates,
        zoom: 8
    });

    // console.log(coordinates);

      const marker = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(coordinates)
        .setPopup(  
          new mapboxgl.Popup({offset: 25})
          .setHTML(`<h4>${ title }</h4><p>Exact Location will be provided after booking!</p>`)
        )
        .addTo(map);


