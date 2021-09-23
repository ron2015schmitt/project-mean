import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PostCreateComponent } from './post-create/post-create.component';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsObserved = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // get posts from back-end using http request!
    return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      ).subscribe((postData) => {
        this.posts = postData;
        // update all the listeners
        this.postsObserved.next([...this.posts]);
      });
  }
  getPostUpdatedListener() {
    return this.postsObserved.asObservable();
  }

  getPost(id: string) {
    // return local copy of post
    return {...this.posts.find(p => p.id === id)};
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.post<{ message: string, id: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(`add response received: `, response.message);
        post.id = response.id;
        this.posts.push(post);
        // update all the listeners
        this.postsObserved.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    // delete from MongoDB
    console.log(`delete button pressed id=${postId}`);
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        // delete from our local copy
        this.posts = this.posts.filter(post => post.id !== postId);
        // update all listeners
        this.postsObserved.next([...this.posts]);
      });
  }

}
