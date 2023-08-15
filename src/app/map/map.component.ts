import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  // constructor() { }

 ngAfterViewInit() {
    let selectedArea: string | null = null;
    let areas = document.querySelectorAll<SVGElement>('path');
    areas.forEach((area) => {
      area.addEventListener('mouseover', function () {
        area.style.fill = 'green';
      });
      area.addEventListener('mouseout', function () {
        area.style.fill = '';
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
        }
      });
    });
  }
}