import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { DeviceService } from './device.service';
import { of } from 'rxjs'; // Import 'of' from RxJS

describe('DeviceService', () => {
  let service: DeviceService;
  let mockDocument: any;

  beforeEach(() => {
    mockDocument = {
      defaultView: {
        innerWidth: 1200, // Initial width, simulating a desktop
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    };

    TestBed.configureTestingModule({
      providers: [DeviceService, { provide: DOCUMENT, useValue: mockDocument }],
    });
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially return "desktop"', (done) => {
    service.getDevice().subscribe((deviceType) => {
      expect(deviceType).toBe('desktop');
      done();
    });
  });

  it('should return "mobile" when window width is less than 768', (done) => {
    mockDocument.defaultView.innerWidth = 700; // Simulate mobile width
    // Trigger a resize event (you might need to adjust this depending on how you're mocking events)
    window.dispatchEvent(new Event('resize'));

    service.getDevice().subscribe((deviceType) => {
      expect(deviceType).toBe('mobile');
      done();
    });
  });

  it('should return "tablet" when window width is between 768 and 1023', (done) => {
    mockDocument.defaultView.innerWidth = 900; // Simulate tablet width
    window.dispatchEvent(new Event('resize'));

    service.getDevice().subscribe((deviceType) => {
      expect(deviceType).toBe('tablet');
      done();
    });
  });

  it('should not emit new value if device type does not change', (done) => {
    const emittedValues: string[] = [];
    service
      .getDevice()
      .subscribe((deviceType) => emittedValues.push(deviceType));

    mockDocument.defaultView.innerWidth = 1100; // Still within desktop range
    window.dispatchEvent(new Event('resize'));

    setTimeout(() => {
      // Give some time for potential emissions
      expect(emittedValues).toEqual(['desktop']); // Should only have emitted the initial value
      done();
    }, 100);
  });
});
