import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, interval, Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
  locked$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit() {
    const rentalPoint$ = this.route.params.pipe(
      map(param => param['id']),
      filter((id): id is string => !!id),
      switchMap(id => this.firestore.collection('rentalPoints').doc<any>(id).valueChanges())
    );

    const currentTime$ = interval(100).pipe(
      map(() => moment()),
    );

    this.locked$ = combineLatest(rentalPoint$, currentTime$).pipe(
      map(([rentalPoint, currentTime]) => {
        if (!rentalPoint || !rentalPoint.openTo) {
          return true;
        }

        return moment(rentalPoint.openTo.toDate()) < currentTime;
      }),
    );
  }
}
