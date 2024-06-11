import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchParticipantsComponent } from './match-participants.component';

describe('MatchParticipantsComponent', () => {
  let component: MatchParticipantsComponent;
  let fixture: ComponentFixture<MatchParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchParticipantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
