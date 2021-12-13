import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsObserved = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    // get posts from back-end using http request!
    const url = environment.apiUrl + '/posts';
    console.log(`send get message to : `, url);
    return this.http.get<{ message: string, posts: any }>(url)
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
        console.log(`get response received: `, postData);
        this.posts = postData;
        // update all the listeners
        this.postsObserved.next([...this.posts]);
      });
  }
  getPostUpdatedListener() {
    return this.postsObserved.asObservable();
  }

  getPost(id: string) {
    // return an observable that consumer can subscribe to   
    return this.http.get<{ _id: string, title: string, content: string, }>(environment.apiUrl + '/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    console.warn(`addPost: post:`, post)
    this.http.post<{ message: string, id: string }>(environment.apiUrl + '/posts', post)
      .subscribe((response) => {
        console.log(`add response received: `, response.message);
        post.id = response.id;
        this.posts.push(post);
        // update all the listeners
        this.postsObserved.next([...this.posts]);
        // navigate back to homepage
        this.router.navigate(["/"]);
      });
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = { id: postId, title, content };
    this.http.put(environment.apiUrl + '/posts/' + postId, post)
      .subscribe((response) => {
        console.log(`put response received: `, response);
        // update local copy. not needed at this point, but do it anyway
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsObserved.next([...this.posts]);
        // navigate back to homepage
        this.router.navigate(["/"]);
      });

  }

  deletePost(postId: string) {
    // delete from MongoDB
    console.log(`delete button pressed id=${postId} path=${environment.apiUrl + '/posts/' + postId}`);
    this.http.delete(environment.apiUrl + '/posts/' + postId)
      .subscribe(() => {
        // delete from our local copy
        this.posts = this.posts.filter(post => post.id !== postId);
        // update all listeners
        this.postsObserved.next([...this.posts]);
      });
  }

}
