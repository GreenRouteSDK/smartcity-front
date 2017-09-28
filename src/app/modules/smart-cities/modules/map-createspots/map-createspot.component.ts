import { Component, OnInit } from '@angular/core';
import { MapCreateSpotService } from './map-createspot.service';
import * as mapboxgl from '../../../../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import * as GlobVars from './globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
    selector: 'map-createspot',
    templateUrl: './map-createspot.component.html',
    styleUrls: ['./map-createspot.component.css'],
    providers: [MapCreateSpotService]
})
export class MapCreateSpotComponent implements OnInit {
  ShowInputData: boolean = false;
  SubmitPoint: boolean = true;
  latitude: string;
  longitude: string;
  BusStops: Array<string> =[];

  dataForm: FormGroup;

  constructor(private MapService: MapCreateSpotService, fb: FormBuilder){
    this.dataForm = fb.group({
      'stop_id': [null, Validators.required],
      'stop_code': ['', Validators.nullValidator],
      'stop_name': [null, Validators.required],
      'stop_desc': ['descripcion ', Validators.nullValidator],
      'zone_id': ['ID', Validators.nullValidator],
      'stop_url': ['URL',Validators.nullValidator],
      'location_type': ['0',Validators.nullValidator],
      'parent_station': ['', Validators.nullValidator],
      'stop_timezone': ['', Validators.nullValidator],
      'wheelchair_boarding': ['0', Validators.nullValidator]
    });
    this.BusStops.push('stop_id, stop_code, stop_name, stop_desc, stop_lat, stop_lon, zone_id,stop_url, location_type, parent_station, stop_timezone, wheelchair_boarding');
    
  }

  ngOnInit(){
    var map = new mapboxgl.Map({
      container: 'mapbox-frame',
      style:'mapbox://styles/mapbox/streets-v9',
      center:[-99.14,19.40],
      zoom:9
    });
    //this.mapService.map = map;

    map.on('mousemove', function(e) {
      //document.getElementById('coordinates').innerHTML= JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat);
      document.getElementById('coordinates').style.display = 'block';
      document.getElementById('coordinates').innerHTML ='Longitud: '+JSON.stringify(e.lngLat.lng) + '<br />Latitude: '+JSON.stringify(e.lngLat.lat); //JSON.stringify(e.lngLat);
    });
    this.pointCircle(map);
    this.createPointsOnClick(map); 
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
    var self = this;
    // GlobVars.geojson_points = {
    //   'type': 'FeatureCollection',
    //   'features': []
    // };
    map.on('load',function(){
      map.addSource('points',{
        type: 'geojson',
        data: GlobVars.geojson_points
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
        let long = ""+ e.lngLat.lng;
        let lati = ""+e.lngLat.lat;
        self.openInputPoint(long, lati);
        //geojson_points.features[0].geometry.coordinates = [e.lngLat.lng,e.lngLat.lat];
        GlobVars.geojson_points.features.push(newPoint);
        map.getSource('points').setData(GlobVars.geojson_points);
        //document.getElementById('info').innerHTML = JSON.stringify(GlobVars.geojson_points);
      });
      
    });
    
  }

  openInputPoint( x: string, y: string ){
    this.ShowInputData = true;
    this.longitude = x;
    this.latitude = y;
  }

  savePoint(){
    this.SubmitPoint = true;
    this.ShowInputData = false;
    this.addPointToList();
  }

  cancelPoint(){
    var self = this;
    this.SubmitPoint = false;
    this.ShowInputData = false;
    GlobVars.geojson_points.features.pop();
  }

  addPointToList(){
    this.BusStops.push( +this.dataForm.controls['stop_id'].value +', '
                        +this.dataForm.controls['stop_code'].value +', '
                        +this.dataForm.controls['stop_name'].value +', '
                        +this.dataForm.controls['stop_desc'].value +', '
                        +this.latitude +', '
                        +this.longitude +', '
                        +this.dataForm.controls['zone_id'].value +', '
                        +this.dataForm.controls['stop_url'].value +', '
                        +this.dataForm.controls['location_type'].value +', '
                        +this.dataForm.controls['parent_station'].value +', '
                        +this.dataForm.controls['stop_timezone'].value +', '
                        +this.dataForm.controls['wheelchair_boarding'].value
                        );//+ this.dataForm['stop_id'];

  }

  downloadFile(){
    var outfile='';
    this.BusStops.forEach(function(item){
      outfile += item + '\n';
    });
    var blob = new Blob([outfile], {type: 'text/csv'});
    var url= window.URL.createObjectURL(blob);
    window.open(url);
  }
  
}
