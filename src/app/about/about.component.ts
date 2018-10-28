import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject, AsyncSubject,
  ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    ngOnInit() {}
    /* 3.36: Async Subject and Replay Subject
    ngOnInit() {
      const subject = new ReplaySubject();
      // const subject = new AsyncSubject();
      const series$ = subject.asObservable();
      series$.subscribe(val => console.log('first sub: ', val));
      subject.next(1);
      subject.next(2);
      subject.next(3);
      subject.complete();
      setTimeout(() => {
        series$.subscribe(val => console.log('second sub: ', val));
      });
    }
    */
    /* 3.35: BehaviorSubject in detail
    ngOnInit() {
      const subject = new BehaviorSubject(0);
      const series$ = subject.asObservable();
      series$.subscribe(val => console.log('early sub: ', val));
      subject.next(1);
      subject.next(2);
      subject.next(3);
      // subject.complete();
      setTimeout(() => {
        series$.subscribe(val => console.log('late sub: ', val));
        subject.next(4);
      }, 3000);
    }
    */
    /* 5.34: What are RxJs Subjects?
    ngOnInit() {
        const subject = new Subject();
        const series$ = subject.asObservable();
        series$.subscribe(console.log);
        subject.next(1);
        subject.next(2);
        subject.next(3);
        subject.complete();
    }
    */
}






