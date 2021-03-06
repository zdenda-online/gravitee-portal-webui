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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from '../../test/translate-testing-module';

import { GvAnalyticsDashboardComponent } from './gv-analytics-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { provideMock } from '../../test/mock.helper.spec';

describe('GvAnalyticsDashboardComponent', () => {
  let component: GvAnalyticsDashboardComponent;
  let fixture: ComponentFixture<GvAnalyticsDashboardComponent>;
  let analyticsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GvAnalyticsDashboardComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateTestingModule, FormsModule, ReactiveFormsModule],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
      providers: [
        provideMock(AnalyticsService)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    analyticsService = TestBed.inject(AnalyticsService);
    fixture = TestBed.createComponent(GvAnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
