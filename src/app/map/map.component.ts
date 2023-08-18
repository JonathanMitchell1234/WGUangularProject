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
    // forEach loop adds event listeners to each path element
    areas.forEach((area) => {
      // event listener calls the API using Angular's HTTPclient when the mouse enters, country is highlighted green
      area.addEventListener('mouseover', () => {
        area.style.fill = 'green';
        const countryCode = area.id.toUpperCase();
        // if the country has no isocode2, the API call is not made
        if (area.id === '') {
          console.log('no isocode2 for this path');
          return;
        }
        // API is called using a template literal that uses the country's isocode2 ID to dynamically update on mouse enter
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
            // data and HTML is injected into an empty div on the right column of map
            flexItem.innerHTML = `
              <h2>${countryName}</h2>
              <p>Country Code: ${countryCode}</p>
              <p>Capital: ${countryCapital}</p>
              <p>Region: ${countryRegion}</p>
              <p>Income Level: ${incomeLevel}</p>
              <p>Longitude: ${longitude}</p>
              <p>Latitude: ${latitude}</p>
            `;
            // Remove the 'fade-in' class first to trigger the animation on subsequent mouseovers
            flexItem.classList.remove('fade-in');
            // Adding the class with a slight delay to re-trigger the animation
            setTimeout(() => {
              flexItem.classList.add('fade-in');
            }, 10);
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
