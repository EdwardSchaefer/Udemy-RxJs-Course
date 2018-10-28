import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {Course} from '../model/course';
import {delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from './util';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
import {filter} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();
  init() {
    const http$ = createHttpObservable('/api/courses');
    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload'])),
      )
      .subscribe(
        courses => this.subject.next(courses)
      );
  }
  selectByCategory(category: string) {
    return this.courses$
      .pipe(
          map(courses => courses
            .filter(course => course.category === category))
      );
  }
  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };
    this.subject.next(newCourses);
    return fromPromise(fetch('/api/courses/' + courseId, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id === courseId)),
      filter(course => !!course)
    );
  }
}
