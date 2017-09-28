import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import * as mapboxgl from '../../../../../../node_modules/mapbox-gl/dist/mapbox-gl.js';

@Component({
  selector: 'map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css'],
  providers: [MapService]
})
export class MapContainerComponent implements OnInit {
  //private map = new mapboxgl.Map();
  constructor(private mapService: MapService) { }

  ngOnInit() {
    // var map = new mapboxgl.Map({
    //   container: 'mapbox-frame',
    //   style:'mapbox://styles/mapbox/streets-v9',
    //   center:[-99.14,19.40],
    //   zoom:5
    // });
    // //this.mapService.map = map;

    // map.on('mousemove', function(e) {
    //   //document.getElementById('coordinates').innerHTML= JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat);
    //   document.getElementById('coordinates').style.display = 'block';
    //   document.getElementById('coordinates').innerHTML ='Longitud: '+JSON.stringify(e.lngLat.lng) + '<br />Latitude: '+JSON.stringify(e.lngLat.lat); //JSON.stringify(e.lngLat);
    // });

    // this.pointCircle(map);
    // this.createPointsOnClick(map);
    
  }

  pointCircle(map: any){
    var radius = 0.1;
    function pointOnCircle(angle) {
      return {
        "type": "Point",
        "coordinates": [
            -99.14 + Math.cos(angle) * radius,
            19.40 + Math.sin(angle) * radius
        ]
      };
    }



    map.on('load', function () {
      map.addSource('point', {
        type: "geojson",
        data: pointOnCircle(0)
      });
      map.addLayer({
        id: "point",
        source: "point",
        type: "symbol",
        layout:{
          'icon-image':'heliport-15',
          'icon-rotate': 15
        }
      });
      function animateMarker(timestamp) {
       map.getSource('point').setData(pointOnCircle(timestamp / 1000));
        requestAnimationFrame(animateMarker);
      }
      animateMarker(0);
    });

  }

  createPointsOnClick(map: any){
    var geojson_points = {
      'type': 'FeatureCollection',
      'features': []
    };
    map.on('load',function(){
      map.addSource('points',{
        type: 'geojson',
        data: geojson_points
      });
      map.addLayer({
        id: 'points-selected',
        type: 'circle',
        source: 'points',
        paint:{
          'circle-radius': 8,
          'circle-color': '#3887be'
        }
      });
      map.on('click',function(e){
        var newPoint = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              e.lngLat.lng,
              e.lngLat.lat
            ]
          }
        }
        //geojson_points.features[0].geometry.coordinates = [e.lngLat.lng,e.lngLat.lat];
        geojson_points.features.push(newPoint);
        map.getSource('points').setData(geojson_points);
        //document.getElementById('info').innerHTML = JSON.stringify(geojson_points);
      });
    });

  }

}