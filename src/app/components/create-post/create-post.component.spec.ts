import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CreatePostComponent } from './create-post.component';
import { CreatePostService } from '../../services/create-post.service';
import { By } from '@angular/platform-browser';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let createPostService: jasmine.SpyObj<CreatePostService>;

  beforeEach(async () => {
    const createPostServiceSpy = jasmine.createSpyObj('CreatePostService', ['createPost']);

    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: CreatePostService, useValue: createPostServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    createPostService = TestBed.inject(CreatePostService) as jasmine.SpyObj<CreatePostService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error message for invalid image', () => {
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [invalidFile] } } as any;

    component.onImageSelected(event);

    expect(component.errorMessage).toBe(
      'Invalid image file. Only JPG, PNG, and WebP formats are allowed (max 2MB).'
    );
    expect(component.image).toBeNull();
  });

  it('should accept valid image', () => {
    const validFile = new File(['test'], 'image.png', { type: 'image/png' });
    const event = { target: { files: [validFile] } } as any;

    component.onImageSelected(event);

    expect(component.errorMessage).toBe('');
    expect(component.image).toEqual(validFile);
  });

  it('should not submit post with text over 140 characters', () => {
    component.postText = 'A'.repeat(141); // 141 characters
    component.submitPost();

    expect(component.errorMessage).toBe('Post text must be 140 characters or less.');
    expect(component.isSubmitting).toBeFalse();
  });

  it('should not submit post without text or image', () => {
    component.postText = '';
    component.image = null;
    component.submitPost();

    expect(component.errorMessage).toBe('Post must have text or an image.');
    expect(component.isSubmitting).toBeFalse();
  });

  it('should call createPostService and emit postCreated on success', () => {
    const formData = new FormData();
    formData.append('text', 'Test post');
    const mockResponse = of<void>(undefined);

    createPostService.createPost.and.returnValue(mockResponse);

    component.postText = 'Test post';
    component.submitPost();

    expect(component.isSubmitting).toBeTrue();
    expect(createPostService.createPost).toHaveBeenCalled();
    mockResponse.subscribe(() => {
      expect(component.successMessage).toBe('Post created successfully!');
      expect(component.errorMessage).toBe('');
      expect(component.isSubmitting).toBeFalse();
    });
  });

  it('should handle error from createPostService', () => {
    const mockError = throwError(() => new Error('Service error'));
    createPostService.createPost.and.returnValue(mockError);

    component.postText = 'Test post';
    component.submitPost();

    expect(component.isSubmitting).toBeTrue();
    mockError.subscribe({
      error: () => {
        expect(component.errorMessage).toBe('Failed to create post. Please try again.');
        expect(component.successMessage).toBe('');
        expect(component.isSubmitting).toBeFalse();
      },
    });
  });

  it('should reset post after successful submission', () => {
    spyOn(component.postCreated, 'emit');
    const mockResponse = of<void>(undefined);
    createPostService.createPost.and.returnValue(mockResponse);

    component.postText = 'Test post';
    component.image = new File(['test'], 'image.png', { type: 'image/png' });
    component.submitPost();

    mockResponse.subscribe(() => {
      expect(component.postText).toBe('');
      expect(component.image).toBeNull();
      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
      expect(component.postCreated.emit).toHaveBeenCalled();
    });
  });

  it('should get user location if available', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success) => {
      const mockPosition = {
        coords: { latitude: 12.34, longitude: 56.78 },
      };
      success( mockPosition);
    });

    component.getUserLocation();

    expect(component.isLocationAvailable).toBeTrue();
    expect(component.latitude).toBe(12.34);
    expect(component.longitude).toBe(56.78);
  });

  it('should handle geolocation error if unavailable', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((_, error) => {
      const mockError = { message: 'User denied geolocation.' };
      error(mockError);
    });

    component.getUserLocation();

    expect(component.isLocationAvailable).toBeFalse();
    expect(component.latitude).toBeNull();
    expect(component.longitude).toBeNull();
  });
});




// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { CreatePostComponent } from './create-post.component';

// describe('CreatePostComponent', () => {
//   let component: CreatePostComponent;
//   let fixture: ComponentFixture<CreatePostComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [CreatePostComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(CreatePostComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
