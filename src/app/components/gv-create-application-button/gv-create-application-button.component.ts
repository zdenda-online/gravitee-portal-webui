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
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gv-create-application-button',
  templateUrl: './gv-create-application-button.component.html',
  styleUrls: ['./gv-create-application-button.component.css']
})
export class GvCreateApplicationButtonComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  @HostListener(':gv-button:click')
  onClick() {
    this.router.navigate(['/applications/creation'], {});
  }

}
