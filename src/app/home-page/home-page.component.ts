import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
})
export class HomePageComponent implements OnInit {

  rentalPoints$: Observable<any>;

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.rentalPoints$ = this.firestore.collection('rentalPoints').snapshotChanges().pipe(
      map(changes => {
        return changes.map(change => {
          return {
            ...change.payload.doc.data(),
            id: change.payload.doc.id,
          };
        });
      })
    );
  }

  next(rentalPoint) {
    this.router.navigate(['/test/', rentalPoint]);
  }
}
