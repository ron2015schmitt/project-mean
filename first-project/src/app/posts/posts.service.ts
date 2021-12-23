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
              creator: post.creator,
              imagePath: post.imagePath
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
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      creator: string,
      imagePath: string
    }>(environment.apiUrl + '/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const url = environment.apiUrl + '/posts';
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    console.warn(`addPost: post:`, postData)
    this.http.post<{ message: string, post: Post }>(url, postData)
      .subscribe((response) => {
        console.log(`add response received: `, response.message);
        this.posts.push(response.post);
        // update all the listeners
        this.postsObserved.next([...this.posts]);
        // navigate back to homepage
        this.router.navigate(["/"]);
      });
  }

  // input may be a FIle (new image selected), or a string (same http file is used)
  updatePost(id: string, title: string, content: string, image: File | string) {
    const url = environment.apiUrl + '/posts/' + id;
    // to prevent hacking, we don't include creator here. backend will fill out
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        creator: '',
        imagePath: image,
      } as Post;
    }
    console.warn(`updatePost: post:`, postData)
    this.http.put<{ message: string, post: Post }>(url, postData)
      .subscribe((response) => {
        console.log(`put response received: `, response);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          creator: response.post.creator,
          imagePath: response.post.imagePath
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsObserved.next([...this.posts]);
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
