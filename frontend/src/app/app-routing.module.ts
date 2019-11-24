import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LiveComponent } from './components/live/live.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { HelpComponent } from './components/help/help.component'

import { MainViewComponent } from './views/main-view/main-view.component';
import { CommonModule } from '@angular/common';
import { LikedClipsComponent } from './components/liked-clips/liked-clips.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: '', component: MainViewComponent, children: [
    { path: 'live', component: LiveComponent }
  ]},
  { path: '', component: MainViewComponent, children: [
    { path: 'archive', component: ArchiveComponent }
  ]},
  { path: '', component: MainViewComponent, children: [
    { path: 'help', component: HelpComponent }
  ]},
  { path: '', component: MainViewComponent, children: [
    { path: 'liked-clips', component: LikedClipsComponent }
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
