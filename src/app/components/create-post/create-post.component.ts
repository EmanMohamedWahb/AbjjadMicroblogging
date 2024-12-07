import { Component, EventEmitter, Output } from '@angular/core';
import { CreatePostService } from '../../services/create-post.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postText: string = '';
  image: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  isLocationAvailable: boolean = false;
  latitude: number | null = null;
  longitude: number | null = null;
  @Output() postCreated = new EventEmitter<void>();
  
  constructor(private createPostService: CreatePostService) {
    this.getUserLocation();
  }
  

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isValidImage(file)) {
      this.image = file;
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid image file. Only JPG, PNG, and WebP formats are allowed (max 2MB).';
    }
  }

  isValidImage(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type) && file.size <= 2 * 1024 * 1024; // 2MB limit
  }

  submitPost(): void {
    const formData = new FormData();
    formData.append('text', this.postText);
    if (this.image) {
      formData.append('image', this.image);
    }

    if (this.postText.length > 140) {
      this.errorMessage = 'Post text must be 140 characters or less.';
      return;
    }

    if (!this.postText.trim() && !this.image) {
      this.errorMessage = 'Post must have text or an image.';
      return;
    }
    
    if (this.isLocationAvailable && this.latitude !== null && this.longitude !== null) {
      formData.append('latitude', this.latitude.toString());
      formData.append('longitude', this.longitude.toString());
    } else {
      console.warn('User location is not available.');
    }

    this.isSubmitting = true;
    this.createPostService.createPost(formData).subscribe({
      next: () => {
        this.successMessage = 'Post created successfully!';
        this.errorMessage='';
        this.isSubmitting = false;
        this.resetPost();
        this.postCreated.emit(); 
      },
      error: (error) => {
        this.errorMessage = 'Failed to create post. Please try again.';
        this.successMessage='';
        this.isSubmitting = false;
        console.error(error);
      }
    });
  }
  private generateRandomCoordinates(): { latitude: number; longitude: number } {
    const latitude = (Math.random() * 180 - 90).toFixed(6); // Random lat: -90 to 90
    const longitude = (Math.random() * 360 - 180).toFixed(6); // Random lng: -180 to 180
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  }
  public getUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.isLocationAvailable = true;
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('User coordinates:', this.latitude, this.longitude);
        },
        (error) => {
          this.isLocationAvailable = false;
          console.error('Error getting location:', error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      this.isLocationAvailable = false;
    }
  }
  private resetPost(){
    this.postText='';
    this.image=null;
    this.successMessage='';
    this.errorMessage='';
  }
}