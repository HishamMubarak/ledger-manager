import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountopsComponent } from './accountops.component';

describe('AccountopsComponent', () => {
  let component: AccountopsComponent;
  let fixture: ComponentFixture<AccountopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
