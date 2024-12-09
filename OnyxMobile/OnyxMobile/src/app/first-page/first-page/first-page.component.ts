import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss'],
})
export class FirstPageComponent  implements OnInit {

  constructor() { }

  ngOnInit():void {
    //console.log('once');
}

ionViewWillEnter():void{
  console.log('home');
}
}
