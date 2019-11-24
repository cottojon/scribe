import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedClipsComponent } from './liked-clips.component';

describe('LikedClipsComponent', () => {
  let component: LikedClipsComponent;
  let fixture: ComponentFixture<LikedClipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikedClipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedClipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
