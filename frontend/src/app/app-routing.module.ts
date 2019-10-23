import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LiveComponent } from './components/live/live.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { TrainingComponent } from './components/training/training.component';
import { HelpComponent } from './components/help/help.component'

import { MainViewComponent } from './views/main-view/main-view.component';
import { CommonModule } from '@angular/common';

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
    { path: 'help', component: HelpComponent }
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
