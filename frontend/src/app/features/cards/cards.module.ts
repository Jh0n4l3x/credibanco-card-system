import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CardListComponent } from './card-list/card-list.component';
import { CardCreateComponent } from './card-create/card-create.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { CardEnrollDialogComponent } from './card-enroll-dialog/card-enroll-dialog.component';

const routes: Routes = [
  { path: '', component: CardListComponent },
  { path: 'create', component: CardCreateComponent },
  { path: ':id', component: CardDetailComponent }
];

@NgModule({
  declarations: [
    CardListComponent,
    CardCreateComponent,
    CardDetailComponent,
    CardEnrollDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class CardsModule { }