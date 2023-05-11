import { SkillType } from 'src/app/Models/skill-type.model';
import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-skill-type',
  templateUrl: './view-skill-type.component.html',
  styleUrls: ['./view-skill-type.component.scss']
})
export class ViewSkillTypeComponent implements OnInit {
  test!: SkillType;
  skillTypeList!: SkillType[];
  id: any;
  
  constructor( 
    public router: Router,
    private location: Location,
    private service: SkillTypeService,
    private dialog: MatDialog,
    private titleservice: Title) { this.titleservice.setTitle('Skill Type');}

  ngOnInit(): void {
    this.test = JSON.parse(sessionStorage['skillType']);
  }

  refreshList() {
    this.service.GetSkillTypes().subscribe((result) => {
    this.skillTypeList = result as SkillType[];
  });
}

onBack() {
  this.location.back();
}

onEdit() {
  this.router.navigate(['admin/maintain-skill-type']);
  this.refreshList();
}

onArrowBack() {
  this.location.back();
}

}
