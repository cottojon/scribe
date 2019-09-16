import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LiveComponent } from './components/live/live.component';
import { AboutComponent } from './components/about/about.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { TrainingComponent } from './components/training/training.component';
import { MainViewComponent } from './views/main-view/main-view.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: '', component: MainViewComponent, children: [
    { path: 'live', component: LiveComponent }
  ]},
  { path: '', component: MainViewComponent, children: [
    { path: 'archive', component: ArchiveComponent }
  ]},
  { path: '', component: MainViewComponent, children: [
    { path: 'training', component: TrainingComponent }
  ]},
  { path: '', component: MainViewComponent, children: [
    { path: 'about', component: AboutComponent }
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
