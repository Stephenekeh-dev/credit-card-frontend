import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTokenDialogComponent } from './verify-token-dialog.component';

describe('VerifyTokenDialogComponent', () => {
  let component: VerifyTokenDialogComponent;
  let fixture: ComponentFixture<VerifyTokenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyTokenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
