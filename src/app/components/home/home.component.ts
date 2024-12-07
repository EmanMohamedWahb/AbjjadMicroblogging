import { Component,OnInit } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  showCreatePost: boolean = false;
  userName: any;

  constructor(private timelineService: TimelineService) {}

  ngOnInit(): void {
    this.loadTimeline();
    this.userName =localStorage.getItem('username');
  }

  loadTimeline(): void {
    this.loading = true;
    this.timelineService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Latest first
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load timeline. Please try again later.';
        this.loading = false;
        console.error(error);
      }
    });
  }

  getBestImage(post: any): string {
    const screenWidth = window.innerWidth;
    return post.images.find((img: any) => img.width <= screenWidth)?.url || post.originalImageUrl;
  }

  showDialog()
  {
      this.showCreatePost=true;
  }
   onPostCreated(): void {
    this.showCreatePost = false; 
    this.loadTimeline(); 
  }
}