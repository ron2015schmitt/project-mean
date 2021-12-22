import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})

export class PostCreateComponent implements OnInit {
  private mode: string = 'create';
  private postId: string;
  post: Post;
  isLoading: boolean = false;
  form: FormGroup;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { 
        validators: [Validators.required, Validators.minLength(3)], 
      }),
      'content': new FormControl(null, { 
        validators: [Validators.required], 
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        // we extratc the postId from the URL parameters
        this.postId = paramMap.get('postId');
        // subscribe to the service that will get the post from the backend
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = { 
            id: postData._id, 
            title: postData.title, 
            content: postData.content,
            creator: postData.creator,
           };
           this.form.setValue({
            title: this.post.title,
            content: this.post.content,
           });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = {
          id: null,
          title: '',
          content: '',
        } as Post;
      }
    });
  }

  onSavePost() {
    const form = this.form;
    if (form.invalid) return;
    console.log(`onSavePost: form:`, form);
    this.isLoading = true;
    if (this.mode === "create") {
      console.log(`onSavePost: create new post`);
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      console.log(`onSavePost: update post id=${this.postId}`);
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.reset();
  }
}
