import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { convertPostFromBackend, Post, PostBE } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsObserved = new Subject<{ posts: Post[], count: number }>();

  constructor(private http: HttpClient, private router: Router) { }


  getPosts(postsPerPage: number, currentPage: number) {
    // get posts from back-end using http request!
    const url = `${environment.apiUrl}/posts?pagesize=${postsPerPage}&page=${currentPage}`;
    console.log(`send get message to : `, url);
    return this.http.get<{ message: string, posts: PostBE[], count: number }>(url)
      .pipe(
        map(response => {
          return {
            posts: response.posts.map(postBE => convertPostFromBackend(postBE)),
            count: response.count,
          };
        })
      ).subscribe((data) => {
        console.log(`get response received: `, data);
        this.posts = data.posts;
        // update all the listeners
        this.postsObserved.next({
          posts: [...this.posts],
          count: data.count,
        });
      });
  }
  getPostUpdatedListener() {
    return this.postsObserved.asObservable();
  }

  getPost(id: string) {
    // return an observable that consumer can subscribe to   
    const url = `${environment.apiUrl}/posts/${id}`;
    return this.http.get<{ message: string, post: PostBE }>(url)
      .pipe(
        map(response => {
          console.warn(`getPost:`, response);
          return convertPostFromBackend(response.post);
        })
      );
  }

  addPost(title: string, content: string, image: File) {
    const url = environment.apiUrl + '/posts';
    // use FormData so that we can send the image
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    console.warn(`addPost: post:`, postData)

    return this.http.post<{ message: string, post: PostBE }>(url, postData)
      .subscribe((response) => {
        console.log(`add response received: `, response.message);
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
      };
    }
    console.warn(`updatePost: post:`, postData)
    this.http.put<{ message: string, post: PostBE }>(url, postData)
      .subscribe((response) => {
        console.log(`put response received: `, response);
        this.router.navigate(["/"]);
      });

  }


  deletePost(id: string) {
    // delete from MongoDB
    const url = environment.apiUrl + '/posts/' + id;
    console.log(`delete button pressed id=${id} path=${environment.apiUrl + '/posts/' + id}`);
    return this.http.delete(url);
  }

}
