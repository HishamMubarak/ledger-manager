import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransopsComponent } from './transops.component';

describe('TransopsComponent', () => {
  let component: TransopsComponent;
  let fixture: ComponentFixture<TransopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
