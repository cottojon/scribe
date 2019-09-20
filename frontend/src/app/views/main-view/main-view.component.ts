import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  @Input()
  navToggle: boolean;

  constructor() { }

  ngOnInit() {
    this.navToggle = false;
  }
}
