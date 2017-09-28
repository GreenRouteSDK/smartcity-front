import { Injectable } from '@angular/core';
import * as mapboxgl from '../../../../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
//import { Map } from '../../../../../../node_modules/mapbox-gl/dist/mapbox-gl.js';

@Injectable()
export class MapService {
    //map: mapboxgl.Map<any, any>;
    constructor(){
        mapboxgl.accessToken = 'pk.eyJ1IjoibWlsbzgwMCIsImEiOiJjaXVyMXJyYmowMDVlMnlxeGNrcWplbTgxIn0.HLuNoJhMYaSb04Wl9oAFBQ'; //satelite map
        //mapboxgl.accessToken = 'pk.eyJ1IjoibWlsbzgwMCIsImEiOiJjaXVyMXJyYmowMDVlMnlxeGNrcWplbTgxIn0.HLuNoJhMYaSb04Wl9oAFBQ'; //
        
    }

}