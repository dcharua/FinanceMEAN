import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSavingComponent } from './saving.component';

describe('AddSavingComponent', () => {
  let component: AddSavingComponent;
  let fixture: ComponentFixture<AddSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
