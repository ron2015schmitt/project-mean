import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
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

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    // get the posts from the back-end
    this.postsService.getPosts();

    // subscribe to PostsService and on each update, we set our array from PostsService's copy
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => (this.posts = posts) );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }
}

