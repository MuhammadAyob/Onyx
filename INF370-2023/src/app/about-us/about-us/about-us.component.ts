import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

dataList!:any[];

constructor(
  private titleservice: Title,
  public router:Router) 

{this.titleservice.setTitle('About Us'); }

ngOnInit(): void {
  this.dataList = ELEMENT_DATA;
}

onBack(){
  this.router.navigate(['/home']);
}

}

export interface Element {
  period:string;
  description: string;
}

const ELEMENT_DATA: Element[] = [
  {
    period: "1876",
    description: "The arrival of Muslims in Pretoria is conservatively given around 1876. They have settled in a number of areas in and around Pretoria."
  },
  {
    period: "1917",
    description: "Various Islamic projects were initiated during this time. Among them were the Pretoria Islamic Society in 1917. Muhtaram Muhammed Akoojee Dockrat also opened a madressah behind his shop in Mayville, Paul Kruger Street. This madressah was later moved to Gazina."
  },
  {
    period: "1931",
    description: "To facilitate the service of Islam, the Pretoria North Muslim Educational Institute was established in 1931."
  },
  {
    period: "1958 – 1962",
    description: "Indians were moved away from their residence because of The Group Areas act. Over sixty years of religious, financial, and personal achievement had to start all over again. The Indian and Muslim community was resettled in Laudium between 1958 and 1962."
  },
  {
    period: "1970",
    description: "In 1970 the PNMEI inaugurated Madressah Miftahul Uloom at the Jacaranda Primary School with approximately 200 learners. The first three teachers were Moulana Ahmed Garda, Muhtaram Goolam Hussain Abed, and Muhtaram Goolam Ebrahim. The madressah served the community from 1970 to 1989 where it moved to a new permanent building at the Darus Salaam Islamic Centre. In 1975 a charity arm of the organization was formed called the Muslim Zakaat and Charity Fund. This was done to facilitate the distribution of Zakaat funds under Ulama supervision to the needy of the community."
  },
  {
    period: "1976",
    description: "In 1976 the PNMEI moved its operation to Mink street. A Musalla Khana and Imamas quarters were constructed on the site."
  },
  {
    period: "1990 – 1993",
    description: "The Pretoria Muslim School was established in 1990. Its initial enrollment was of 150 pupils and 14 staff. In 1993 the center was moved to the Darus Salaam Centre Cnr 19th Avenue and Corundum street."
  }
];
