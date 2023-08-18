import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.setupSvgEvents();
  }

  setupSvgEvents = () => {
    let selectedArea: string | null = null;
    let areas = document.querySelectorAll<SVGElement>('path');
    areas.forEach((area) => {
      // event listener calls the API using Angular's HTTPclient when the mouse enters, country is highlighted green
      area.addEventListener('mouseover', () => {
        area.style.fill = 'green';
        const countryCode = area.id.toUpperCase();
        if (area.id === '') {
          console.log('no isocode2 for this path');
          return;
        }
        // API is called using a template literal that uses the country's isocode2 to dynamically update on mouse enter
        const url = `http://api.worldbank.org/v2/country/${countryCode}?format=json`;
        this.http.get(url).subscribe((data: any) => {
          const countryData = data[1][0];
          const countryName = countryData.name;
          const countryCapital = countryData.capitalCity;
          const countryRegion = countryData.region.value;
          const incomeLevel = countryData.incomeLevel.value;
          const longitude = countryData.longitude;
          const latitude = countryData.latitude;

          const flexItem = document.querySelector('.flex-items:nth-child(2)');
          if (flexItem) {
            // data is parsed into the empty div
            flexItem.innerHTML = `
              <h2>${countryName}</h2>
              <p>Country Code: ${countryCode}</p>
              <p>Capital: ${countryCapital}</p>
              <p>Region: ${countryRegion}</p>
              <p>Income Level: ${incomeLevel}</p>
              <p>Longitude: ${longitude}</p>
              <p>Latitude: ${latitude}</p>
            `;
          }
        });
      });
      // event listener removes the highlight when the mouse leaves the selected area
      area.addEventListener('mouseout', function () {
        if (selectedArea !== area.id) {
          area.style.fill = '';
        }
      });
    });
  };
}
