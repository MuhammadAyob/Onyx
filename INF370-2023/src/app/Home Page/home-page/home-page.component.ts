import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
title = 'Onyx';

  constructor(private titleservice:Title) { this.titleservice.setTitle('Onyx'); }

  ngOnInit(): void {
  }

}
