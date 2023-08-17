import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
    this.setupSvgEvents();
  }

  fetchData() {
    this.http.get('http://api.worldbank.org/v2/country/all?format=json')
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  setupSvgEvents = () => {
    let selectedArea: string | null = null;
    let areas = document.querySelectorAll<SVGElement>('path');
    areas.forEach((area) => {
      area.addEventListener('mouseover', () => {
        area.style.fill = 'green';
        const countryCode = area.id.toUpperCase();
        const url = `http://api.worldbank.org/v2/country/${countryCode}?format=json`;
        this.http.get(url).subscribe((data: any) => {
          const countryData = data[1][0];
          const countryName = countryData.name;
          const countryCapital = countryData.capitalCity;
          const countryRegion = countryData.region.value;
          const incomeLevel = countryData.incomeLevel.value;

          const flexItem = document.querySelector('.flex-items:nth-child(2)');
          if (flexItem) {
            flexItem.innerHTML = `
              <h2>${countryName}</h2>
              <p>Country Code: ${countryCode}</p>
              <p>Capital: ${countryCapital}</p>
              <p>Region: ${countryRegion}</p>
              <p>Income Level: ${incomeLevel}</p>
            `;
          }
        });
      });

      area.addEventListener('mouseout', function () {
        if (selectedArea !== area.id) {
          area.style.fill = '';
        }
      });

      area.addEventListener('click', function () {
        if (selectedArea) {
          const selectedElement = document.querySelector<SVGElement>(`#${selectedArea}`);
          if (selectedElement) {
            selectedElement.setAttribute('class', 'st0');
          }
        }
        if (selectedArea !== area.id) {
          selectedArea = area.id;
          area.setAttribute('class', 'selectedArea');
        } else {
          selectedArea = null;
        }
      });

      // Add more event listeners here if needed
      // area.addEventListener('mousedown', ...);
      // area.addEventListener('mouseup', ...);
      // ...
    });
  }
}
