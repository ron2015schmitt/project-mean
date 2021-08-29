import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    // The use of [...this.posts] create a copy of the private array.
    return [...this.posts];
  }
  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {title, content};
    this.posts.push(post);
    // update all the listeners
    this.postsUpdated.next([...this.posts]);
  }

}
