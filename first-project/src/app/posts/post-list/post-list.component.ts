import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  isLoading: boolean = false;
  postsPerPage = 5;
  currentPage = 1;
  totalPosts = 100;
  pageSizeOptions = [1,2,5,10,20,50];
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    // get the posts from the back-end
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    // subscribe to PostsService and on each update, we set our array from PostsService's copy
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((data: { posts: Post[], count: number }) => {
        this.posts = data.posts;
        this.totalPosts = data.count;
        this.isLoading = false;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.getPosts();
    });
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.getPosts();
  }

  getPosts() {
    this.postsService.getPosts(this.postsPerPage,  this.currentPage)
  }
}

