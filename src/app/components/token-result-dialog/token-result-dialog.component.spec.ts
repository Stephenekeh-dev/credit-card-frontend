import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenResultDialogComponent } from './token-result-dialog.component';

describe('TokenResultDialogComponent', () => {
  let component: TokenResultDialogComponent;
  let fixture: ComponentFixture<TokenResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenResultDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
