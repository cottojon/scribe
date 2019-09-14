import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LiveComponent } from './components/live/live.component';
import { AboutComponent } from './components/about/about.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { TrainingComponent } from './components/training/training.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'live', component: LiveComponent },
  { path: 'archive', component: ArchiveComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
