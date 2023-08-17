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
    this.http.get('http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json')
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  setupSvgEvents() {
    let selectedArea: string | null = null;
    let areas = document.querySelectorAll<SVGElement>('path');
        areas.forEach((area) => {
          area.addEventListener('mouseover', () => {
            area.style.fill = 'green';
            const country = area.id.toUpperCase();
            const url = `http://api.worldbank.org/v2/country/${country}/indicator/SP.POP.TOTL?format=json`;
            this.http.get(url).subscribe((data: any) => {
              const population = data[1][0].value;
              const flexItem = document.querySelector('.flex-items:nth-child(2)');
              if (flexItem) {
                flexItem.innerHTML = `<h2>${country}</h2><p>Population: ${population}</p>`;
              }
            });
          });
          area.addEventListener('mouseout', function () {
            if (selectedArea !== area.id) {
              area.style.fill = '';
            }
          });
          area.addEventListener('click', function () {
            console.log(selectedArea);
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
        });
      }
    }
