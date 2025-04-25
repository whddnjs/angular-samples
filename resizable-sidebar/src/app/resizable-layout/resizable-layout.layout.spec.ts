import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableLayoutLayout } from './resizable-layout.layout';

describe('ResizableLayoutLayout', () => {
  let component: ResizableLayoutLayout;
  let fixture: ComponentFixture<ResizableLayoutLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableLayoutLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizableLayoutLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
