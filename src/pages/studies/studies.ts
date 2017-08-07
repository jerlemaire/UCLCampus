/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, MenuController, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { StudiesService} from '../../providers/studies-service';
import { Course } from '../../app/entity/course';
import { AdeProject } from '../../app/entity/adeProject';

import { CoursePage } from '../course/course';
import { ModalProjectPage } from './modal-project/modal-project';

@Component({
  selector: 'page-studies',
  templateUrl: 'studies.html',

})
export class StudiesPage {
  public people: any;
  public data : any;
  public listCourses: Course[];
  public course : Course;
  public title: any;
  public sessionId: string;
  public projectId : string = null;

  constructor(
    public studiesService: StudiesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public storage:Storage,
    public menu: MenuController,
    public platform: Platform,
    private iab: InAppBrowser,
    public modalCtrl: ModalController
  ) {
    this.title = this.navParams.get('title');
    this.menu.enable(true, "studiesMenu");
    this.getCourses();
  }

  openModalProject(){
    let obj = {sessionId : this.sessionId};

    let myModal = this.modalCtrl.create(ModalProjectPage, obj);
    myModal.onDidDismiss(data => {
      console.log("openModalProject data : " + data)
      this.projectId = data;
      console.log("openModalProject projectId : " + data)
    });
    myModal.present();
  }

  initializeSession(){
    this.studiesService.openSession().then(
      data => {
        console.log("data in studies.ts");
        console.log(data);
        this.sessionId = data.toString();
        console.log(this.sessionId);
        if (this.projectId === null) {
          this.openModalProject();
        } else {
          this.studiesService.setProject(this.sessionId,this.projectId).then(
            data => {
              console.log("data in setProject");
              console.log(data);
            }
          );
        }
    });
  }




  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Add Course',
      message: "Enter the name and acronym of the course...",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'acronym',
          placeholder: 'Acronym'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            console.log(data)
            this.saveCourse(data.name, data.acronym);
          }
        }
      ]
    });
    prompt.present();
  }

  getCourses(){
    this.storage.get('listCourses').then((data) => {if(data==null) {this.listCourses=[]} else { this.listCourses=data}});
  }

  saveCourse(name: string, tag: string){
    let course = new Course(name,tag, null);

    console.log(course);
    this.listCourses.push(course);
    this.storage.set('listCourses',this.listCourses);
  }

  removeCourse(course: Course){
    let index= this.listCourses.indexOf(course);
    if(index>= 0){
      this.listCourses.splice(index,1);
    }
    this.storage.set('listCourses',this.listCourses);
  }

  openCoursePage(course: Course){
    console.log(course);
    this.navCtrl.push(CoursePage, {course : course, projectId : this.projectId, sessionId : this.sessionId});
  }

  ionViewDidLoad() {
    console.log('Hello StudiesPage Page');
    this.initializeSession();
  }

  launch(url) {
    let browser = this.iab.create(url,'_system');
  }



}
