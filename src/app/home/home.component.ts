import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {finalize} from 'rxjs/internal/operators';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  constructor() {}
  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    // 3.27: The retry RxJs error handling strategy
    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log('http')),
        map(res => Object.values(res['payload'])),
        shareReplay(),
        retryWhen(errors => errors.pipe(
          delayWhen(() => timer(2000))
        ))
      );

    /* 3.26: catch and rethrow error handling and finalize operatior
          .pipe(
        catchError(err => {
          console.log('error occurred', err);
          return throwError(err);
        }),
        finalize(() => {
          console.log('finalize executed');
        }),
        tap(() => console.log('http')),
        map(res => Object.values(res['payload'])),
        shareReplay()
    */

    /* 3.25: catch and replace error handling strategy
      catchError(err => of([{
        id: 0,
        description: "RxJs In Practice Course",
        iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
        category: 'BEGINNER',
        lessonsCount: 10}]))
    */

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses
        .filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses
        .filter(course => course.category === 'ADVANCED'))
    );
  }


  /* imperative design
    beginnerCourses: Course[];
    advancedCourses: Course[];
    constructor() {

    }
    ngOnInit() {
      const http$ = createHttpObservable('/api/courses');
      const courses$ = http$
        .pipe(
          map(res => Object.values(res['payload']))
        );
      courses$.subscribe(
        courses => {
          this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
          this.advancedCourses = courses.filter(course => course.category === 'ADVANCED');
        },
        noop(),
        () => console.log('completed')
      );
    }
    */
}
