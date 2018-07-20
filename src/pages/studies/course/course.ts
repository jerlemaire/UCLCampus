/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
    This file is part of UCLCampus
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

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
import { NavController, NavParams, ItemSliding, ToastController, AlertController  } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { CourseService } from '../../../providers/studies-services/course-service';
import { UserService } from '../../../providers/utils-services/user-service';

import { Course } from '../../../app/entity/course';
import { Activity } from '../../../app/entity/activity'
import { Calendar } from '@ionic-native/calendar';

@IonicPage()
@Component({
  selector: 'page-course',
  templateUrl: 'course.html'
})

export class CoursePage {
  sessionId : string = this.navParams.get('sessionId');
  course : Course = this.navParams.get("course");
  segment = 'Cours magistral';
  slotTP:string = "no";
  slotCM:string = "no";
  displayedActi : Array<Activity> = [];
  courseSorted : {cm:Array<Activity>, tp:Array<Activity>, ex:Array<Activity>};


  constructor(public navCtrl: NavController,
              public courseService: CourseService,
              private calendar: Calendar,
              public toastCtrl: ToastController,
              public userS:UserService,
              private alertCtrl : AlertController,
              private translateService: TranslateService,
              public navParams:NavParams)
  {
      this.courseSorted = {cm : [], tp : [], ex :[]};
      let acro = this.course.acronym;
      if(this.userS.hasSlotCM(acro)){
        this.slotCM = this.userS.getSlotCM(acro);
      }
      if(this.userS.hasSlotTP(acro)){
        this.slotTP = this.userS.getSlotTP(acro);
      }
  }

  ionViewDidLoad() {
    this.getCourse(this.sessionId, this.course.acronym);
  }

///////////UNCOMMENT BELOW TO HIDE PREVIOUS COURSE
  getCourse(sessionId : string, acronym : string){
    this.courseService.getCourseId(sessionId, acronym).then(
      data => {
        let courseId = data;
        this.courseService.getActivity(sessionId, courseId).then(
          data => {
            this.course.activities = data.sort(
              (a1,a2) => a1.start.valueOf() - a2.start.valueOf()
            ).filter(
                activitie => activitie.end.valueOf() > Date.now().valueOf()
              ); // display only activities finished after now time
              this.displayedActi=this.course.activities;
              this.courseSorted.cm = this.course.activities.filter(acti => acti.type === 'Cours magistral');
              this.courseSorted.tp = this.course.activities.filter(acti => (acti.type === 'TD' || acti.type === 'TP'));
              this.courseSorted.ex = this.course.activities.filter(acti => acti.isExam);
              this.updateDisplayed();
          }

        )
      }
    )
  }

  addToCalendar(slidingItem : ItemSliding, activity : Activity){
    let options:any = {
    };
    let message:string;
    this.translateService.get('COURSE.MESSAGE').subscribe((res:string) => {message=res;});
    this.calendar.createEventWithOptions(this.course.name +" : " + activity.type,
      activity.auditorium, null, activity.start,
      activity.end, options).then(() => {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000
        });
        toast.present();
        slidingItem.close();
    });
      this.alert();
  }

  alert(){
    let title:string;
    let message:string;
    this.translateService.get('COURSE.WARNING').subscribe((res:string) => {title=res;});
    this.translateService.get('COURSE.MESSAGE3').subscribe((res:string) => {message=res;});
         let disclaimerAlert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: "OK",
                    handler: data => {
                    }
                }
            ]
        });
        disclaimerAlert.present();
  }

  updateDisplayedTP(){
      let toFilter = this.courseSorted.tp;

      let toPush;
      if(this.slotTP != "no") toPush = toFilter.filter(acti => ( acti.name === this.slotTP || acti.name.indexOf('-') > -1));
      else toPush = this.courseSorted.tp;
      this.displayedActi = this.displayedActi.concat(toPush);
  }

  updateDisplayedCM(){
      let toFilter = this.courseSorted.cm;

      let toPush:Array<Activity>;
      if(this.slotCM != "no") toPush = toFilter.filter(acti => ( acti.name === this.slotCM));
      else toPush = this.courseSorted.cm;
      this.displayedActi = this.displayedActi.concat(toPush);
  }

  updateDisplayed(){
    console.log(this.displayedActi);
    console.log(this.courseSorted);
    this.displayedActi = [];
    this.updateDisplayedCM();
    this.updateDisplayedTP();
    this.displayedActi = this.displayedActi.concat(this.courseSorted.ex);
    console.log(this.displayedActi);
  }

  showPrompt(segment: string){
    let title:string;
    let message:string;
    let cancel:string;
    let apply:string;
    this.translateService.get('COURSE.TITLE').subscribe((res:string) => {title=res;});
    this.translateService.get('COURSE.MESSAGE2').subscribe((res:string) => {message=res;});
    this.translateService.get('COURSE.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('COURSE.APPLY').subscribe((res:string) => {apply=res;});
    var options = {
      title: title,
      message: message,
      inputs : [],
      buttons : [
      {
          text: cancel,
          handler: data => {

          }
      },
      {
          text: apply,
          handler: data => {
            if(segment == "Cours magistral") {
              this.slotCM = data;
              this.userS.addSlotCM(this.course.acronym,this.slotCM);
            }
            if(segment == "TD") {
              this.slotTP = data;
              this.userS.addSlotTP(this.course.acronym,this.slotTP);
            }
            this.updateDisplayed();
          }
      }]};

     let aucun = ((this.slotTP === 'no' && segment === 'TD') || (this.slotCM === 'no' && segment === 'Cours magistral'));
    let array = this.getSlots(segment);
    for(let i=0; i< array.length; i++) {
       let slotChosen = (this.slotTP === array[i].name || this.slotCM === array[i].name);
      options.inputs.push({ name : 'options', value: array[i].name , label: array[i].name + " " + array[i].start.getHours()+":"+array[i].start.getUTCMinutes() , type: 'radio', checked: slotChosen });
    }
    if(options.inputs.length > 1) options.inputs.push({name:'options', value:"no", label : "Toutes", type : 'radio', checked: aucun});
    let prompt = this.alertCtrl.create(options);
    if(options.inputs.length > 1)prompt.present();
  }

  getSlots(segment:string){
    let act: Activity[] = this.course.activities;
     act = act.filter(
      acti => (acti.type == segment || (acti.type == "TP" && segment == "TD") || (segment == "Examen" && acti.isExam))
      );

//retrieve name of each slot
    let slots = act.map(item => item.name)
      .filter((value, index, self) => self.indexOf(value) === index); //keep only different

//delete some session (like seance aide etude)
    if(segment == "TD") slots = slots.filter(acti => acti.indexOf("_") !== -1);
    if(segment == "Cours magistral") slots = slots.filter(acti => acti.indexOf("-") !== -1);
    let newAct: Activity[] = [];

//retrieve one activity of each slot
    for(let i=0; i< slots.length; i++){
      let activity:Activity = act.find(acti => acti.name == slots[i]);
      newAct.push(activity);
    }

    return newAct;
  }

  addCourseToCalendar(){
    let options:any = {
    };
    for (let activity of this.displayedActi) {
      this.calendar.createEventWithOptions(this.course.name +" : " + activity.type,
        activity.auditorium, null, activity.start,activity.end, options);
    }
    let message:string;
    this.translateService.get('STUDY.MESSAGE3').subscribe((res:string) => {message=res;});

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
    this.alertAll();
  }

  //alert to warning that changes are possible
    alertAll(){
      let title:string;
      let message:string;
      this.translateService.get('STUDY.WARNING').subscribe((res:string) => {title=res;});
      this.translateService.get('STUDY.MESSAGE4').subscribe((res:string) => {message=res;});
         let disclaimerAlert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: "OK",
                    handler: data => {
                    }
                }
            ]
        });
        disclaimerAlert.present();
  }

}
