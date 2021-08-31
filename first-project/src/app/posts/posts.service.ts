import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // get posts from back-end using http request!
    return this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        // update all the listeners
        this.postsSubject.next([...this.posts]);
      });
  }
  getPostUpdatedListener() {
    return this.postsSubject.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '[id here]', title, content };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(`response received: `, response.message);
      });

    this.posts.push(post);
    // update all the listeners
    this.postsSubject.next([...this.posts]);
  }

}
