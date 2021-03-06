/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
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

import { NavController, NavParams } from '@ionic/angular';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { EmployeeItem } from '../../../app/entity/employeeItem';
import { ConnectivityService } from '../../../services/utils-services/connectivity-service';
import { RepertoireService } from '../../../services/wso2-services/repertoire-service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'page-employee-details',
  templateUrl: 'employee-details.html',
  animations: [
    trigger('expand', [
      state('true', style({height: '45px'})),
      state('false', style({height: '0'})),
      transition('void => *', animate('0s')),
      transition('* <=> *', animate('250ms ease-in-out'))
    ])
  ]
})
export class EmployeeDetailsPage {
  empDetails: EmployeeItem;
  address: any;
  searching = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public repService: RepertoireService,
    public connService: ConnectivityService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.empDetails = this.router.getCurrentNavigation().extras.state.emp;
      }
      this.searching = true;
      if (this.connService.isOnline()) {
        this.repService.loadEmpDetails(this.empDetails).then((res: EmployeeItem) => {
            this.empDetails = res;
          }
        );
      } else {
        this.connService.presentConnectionAlert();
      }
      this.searching = false;
    });
  }

  openPage(url: string) {
    window.open(url, '_blank');
  }
}
