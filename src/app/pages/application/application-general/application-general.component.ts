/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import '@gravitee/ui-components/wc/gv-list';
import '@gravitee/ui-components/wc/gv-info';
import '@gravitee/ui-components/wc/gv-rating-list';
import '@gravitee/ui-components/wc/gv-confirm';
import '@gravitee/ui-components/wc/gv-file-upload';
import { getPictureDisplayName } from '@gravitee/ui-components/src/lib/item';
import {
  Application,
  ApplicationService,
  ApiService,
  SubscriptionService,
  PermissionsService,
  PermissionsResponse, Subscription
} from '@gravitee/ng-portal-webclient';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GvHeaderItemComponent } from '../../../components/gv-header-item/gv-header-item.component';
import { EventService, GvEvent } from '../../../services/event.service';
import { LoaderService } from '../../../services/loader.service';
import { NotificationService } from '../../../services/notification.service';
import StatusEnum = Subscription.StatusEnum;

@Component({
  selector: 'app-application-general',
  templateUrl: './application-general.component.html',
  styleUrls: ['./application-general.component.css']
})
export class ApplicationGeneralComponent implements OnInit, OnDestroy {
  applicationForm: FormGroup;
  application: Application;
  connectedApis: Promise<any[]>;
  miscellaneous: any[];
  permissions: PermissionsResponse;
  canUpdate: boolean;
  canDelete: boolean;

  constructor(
    private applicationService: ApplicationService,
    private subscriptionService: SubscriptionService,
    private apiService: ApiService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private permissionsService: PermissionsService,
    private eventService: EventService
  ) {
  }

  ngOnDestroy() {
    this.reset();
  }

  ngOnInit() {
    this.application = this.route.snapshot.data.application;
    this.permissions = this.route.snapshot.data.permissions;
    if (this.application) {
      this.canDelete = this.permissions.DEFINITION && this.permissions.DEFINITION.includes('D');
      this.canUpdate = this.permissions.DEFINITION && this.permissions.DEFINITION.includes('U');
      this.applicationForm = this.formBuilder.group(this.application);
      this.applicationForm.setControl('picture', new FormControl(this.application.picture));
      this.applicationForm.setControl('settings', new FormGroup({
        app: new FormGroup({
          type: new FormControl(''),
        }),
        oauth: new FormGroup({
          client_id: new FormControl(''),
          client_secret: new FormControl(''),
        })
      }));
      this.reset();
      this.applicationForm.get('picture').valueChanges.subscribe((picture) => {
        this.eventService.dispatch(new GvEvent(GvHeaderItemComponent.UPDATE_PICTURE, { data: picture }));
      });

      this.applicationForm.get('name').valueChanges.subscribe((name) => {
        this.eventService.dispatch(new GvEvent(GvHeaderItemComponent.UPDATE_NAME, { data: name }));
      });

      this.translateService.get([
        i18n('application.miscellaneous.owner'),
        i18n('application.miscellaneous.type'),
        i18n('application.miscellaneous.createdDate'),
        i18n('application.miscellaneous.lastUpdate'),
        'application.types'
      ], { type: this.application.applicationType })
        .toPromise()
        .then(translations => {
          const _translations = Object.values(translations);
          this.miscellaneous = [
            { key: _translations[0], value: this.application.owner.display_name },
            { key: _translations[1], value: _translations[4] },
            {
              key: _translations[2],
              value: new Date(this.application.created_at),
              date: 'short'
            },
            {
              key: _translations[3],
              value: new Date(this.application.updated_at),
              date: 'relative'
            },
          ];
        });

      this.connectedApis = this.applicationService.getSubscriberApisByApplicationId({
        applicationId: this.application.id,
        statuses: [StatusEnum.ACCEPTED],
      })
        .toPromise()
        .then((response) => response.data.map((api) => ({ item: api, type: 'api' })));
    }
  }

  reset() {
    if (this.applicationForm) {
      this.applicationForm.reset(this.application);
    }
  }

  submit() {
    if (!this.loaderService.get() && this.canUpdate) {
      this.applicationService.updateApplicationByApplicationId(
        { applicationId: this.application.id, Application: this.applicationForm.value }).subscribe((application) => {
        this.application = application;
        this.reset();
        this.notificationService.success(i18n('application.success.save'));
        this.eventService.dispatch(new GvEvent(GvHeaderItemComponent.RELOAD_EVENT));
      });
    }
  }

  get applicationPicture() {
    return this.applicationForm.value.picture || this.application.picture || this.application._links.picture;
  }

  get displayName() {
    return getPictureDisplayName(this.application);
  }

  delete() {
    this.applicationService.deleteApplicationByApplicationId({ applicationId: this.application.id }).toPromise().then(() => {
      this.router.navigate(['applications']);
      this.notificationService.success(i18n('application.success.delete'));
    });
  }

  renewSecret() {
    this.applicationService.renewApplicationSecret({ applicationId: this.application.id }).toPromise().then((application) => {
      this.application = application;
      this.reset();
      this.notificationService.success(i18n('application.success.renewSecret'));
    });
  }

  isLoading() {
    return this.loaderService.isLoading;
  }

}
