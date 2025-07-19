import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionApprovalDialogComponent } from './transaction-approval-dialog.component';

describe('TransactionApprovalDialogComponent', () => {
  let component: TransactionApprovalDialogComponent;
  let fixture: ComponentFixture<TransactionApprovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionApprovalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
