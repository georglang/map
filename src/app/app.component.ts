import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let L;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'maps';
  map;
  marker;
  public customerForm: FormGroup;
  favoriteSeason: string;
  seasons: string[] = ['Kontakt besteht', 'Anfrage gestellt', 'Kein Kontakt'];


  constructor(
    private formBuilder: FormBuilder
  ) {

  }

  public test() {
    debugger;
  }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      street: ['', Validators.required],
      zipCode: ['', Validators.required],
      place: ['', Validators.required],
      contactPerson: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    this.createMap();
    // this.setSearchControl();
    var searchControl = new L.Control.Search({
      propertyName: 'Name',
      marker: false,
      moveToLocation: function (latlng) {
        this.map.setView(latlng, 12); // set the zoom
      }
    });
  }

  public createMap() {
    this.map = L.map('map').setView([47.6413744, 10.8275033], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  public setSearchControl() {
    const mobileOpts = {
      url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      formatData: this.formatJSON,
      textPlaceholder: 'Color...',
      autoType: false,
      tipAutoSubmit: true,
      autoCollapse: false,
      autoCollapseTime: 20000,
      delayType: 800,	//with mobile device typing is more slow
      marker: {
        icon: true
      }
    };

    var searchLayer = L.layerGroup().addTo(this.map);
    this.map.addControl(new L.Control.Search({ layer: searchLayer }));
  }

  public formatJSON(rawjson) {	//callback that remap fields name
    var json = {},
      key, loc, disp = [];
    for (var i in rawjson) {
      disp = rawjson[i].display_name.split(',');
      key = disp[0] + ', ' + disp[1];
      loc = L.latLng(rawjson[i].lat, rawjson[i].lon);
      json[key] = loc;	//key,value format
    }
    return json;
  }

  public setMarker(form) {
    var greenIcon = L.icon({
      iconUrl: './../assets/leaf-green.png',
      shadowUrl: './../assets/leaf-shadow.png',

      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const lat = 47.6413744;
    const lng = 10.8275033;

    this.marker = L.marker([lat, lng], { icon: greenIcon }).addTo(this.map);
    this.marker.bindPopup(
      `
      <div><strong>${form.companyName}</strong></div
      <div>${form.street}</div>
      <div>${form.zipCode} ${form.place}</div>
      <br>
      <div>${form.contactPerson}</div
      <div>${form.phoneNumber}</div>
      `);
  }

  onSubmit(form) {
    this.setMarker(form);
  }


}
