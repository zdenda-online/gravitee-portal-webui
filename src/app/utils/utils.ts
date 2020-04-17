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
import { Observable } from 'rxjs';
import { TimeTooLongError } from '../exceptions/TimeTooLongError';

export function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new TimeTooLongError());
    }, time);
  });
}

export function sequence(obs: Observable<any>) {
  const timeBeforeSkeleton = 250;
  const minimumTimeOfSkeleton = 500;
  const observable = new Observable(observer => {
    const start = new Date().getTime();
    let end = null;

    const timer = setTimeout(() => {
      observer.next(null);
      end = new Date().getTime();
    }, timeBeforeSkeleton);

    obs.subscribe((e) => {
      clearTimeout(timer);
      if (end && (end - start) < minimumTimeOfSkeleton) {
        setTimeout(() => {
          observer.next(e);
        }, minimumTimeOfSkeleton - (end - start));
      } else {
        observer.next(e);
      }
    });

  });
  return observable;
}
