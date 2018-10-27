import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {throttle, throttleTime} from 'rxjs/internal/operators';
import {debug, setRxJsLoggingLevel} from '../common/debug';
import {RxJsLoggingLevel} from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    @ViewChild('searchInput') input: ElementRef;
    constructor(private route: ActivatedRoute) {}
    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable('/api/courses/' + this.courseId).pipe(
          debug(RxJsLoggingLevel.INFO, 'course value '),
        );
        const lessons$ = this.loadLessons();
        forkJoin(this.course$, lessons$)
          .pipe(
            tap(([course, lessons]) => {
              console.log(course);
              console.log(lessons);
            })
          )
          .subscribe(console.log);
        setRxJsLoggingLevel(RxJsLoggingLevel.ERROR);
    }
    ngAfterViewInit() {
      this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event['target'].value),
          startWith(''),
          debug(RxJsLoggingLevel.TRACE, 'search'),
          debounceTime(400),
          distinctUntilChanged(),
          // bad because it doesn't cancel the current search
          // concatMap(search => this.loadLessons(search))
          // FIXME: does not seem to cancel requests
          switchMap(search => this.loadLessons(search)),
          debug(RxJsLoggingLevel.DEBUG, 'lessons: value')
        );
        /* 3.29: RxJS throttling vs debouncing
        .pipe(
          map(event => event['target'].value),
          startWith(''),
          throttleTime(500),
          // throttle(() => interval(400))
        ).subscribe(console.log);
        */
    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable('/api/lessons?courseId=' + this.courseId + '&pageSize=100&filter=' + search)
        .pipe(
          map(res => res['payload'])
        );
    }
}
