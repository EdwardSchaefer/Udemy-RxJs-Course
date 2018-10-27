import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {concat, fromEvent, interval, merge, noop, Observable, of, timer} from 'rxjs';
import { createHttpObservable } from '../common/util';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    /* 2.20: unsubscribe before HTTP request returns
    const http$ = createHttpObservable('/api/courses');
    const sub = http$.subscribe(console.log);
    setTimeout(() => sub.unsubscribe(), 0);
    */

    // 2.20: unsubscribe example
    /*
    const interval$ = interval(1000);
    const sub = interval$.subscribe(console.log);
    setTimeout(() => sub.unsubscribe(), 5000);
    */

    // 2.17
    /*
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => 10 * val));
    const result$ = merge(interval1$, interval2$);
    result$.subscribe(console.log);
    */

    /*
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);
    const result$ = concat(source1$, source2$, source3$);
    result$.subscribe(
      val => console.log(val)
    );

    */

    // const http$ = createHttpObservable('/api/courses');
    //
    // const courses$ = http$
    //   .pipe(
    //     map(res => Object.values(res['payload']))
    //   );
    //
    // courses$.subscribe(
    //   courses => console.log(courses),
    //   noop(),
    //   () => console.log('completed')
    // );

    // const timer$ = timer(3000, 1000);
    // const sub = timer$.subscribe(val => console.log('stream: ', val));
    // setTimeout(() => sub.unsubscribe(), 5000);
    // const click$ = fromEvent(document, 'click');
    // click$.subscribe(
    //   evt => console.log(evt),
    //   err => console.log(err),
    //   () => console.log('complete')
    // );

    // const interval$ = interval(1000);
    // interval$.subscribe(val => console.log('steam 1: ', val));
    // interval$.subscribe(val => console.log('steam 2: ', val));

    // document.addEventListener('click', e => {
    //   console.log(e);
    // });
    //
    // let counter = 1;
    //
    // setInterval(() => {
    //   console.log(counter);
    //   counter++;
    // }, 1000);
    //
    // setTimeout(() => {
    //   console.log('timeout');
    // }, 3000);
  }
}
