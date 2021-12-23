import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { convertPostFromBackend, Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
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
  imagePreview: ArrayBuffer | String = null;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      content: new FormControl(null, {
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
        this.postsService.getPost(this.postId).subscribe(post => {
          console.warn(post);
          this.post = post;
          this.form.setValue({
            title: post.title,
            image: post.imagePath,
            content: post.content,
          });
          this.imagePreview = post.imagePath as String;
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
      this.postsService.addPost(form.value.title, form.value.content, form.value.image);
    } else {
      console.log(`onSavePost: update post id=${this.postId}`);
      this.postsService.updatePost(this.postId, form.value.title, form.value.content, form.value.image);
    }
    form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <ArrayBuffer>reader.result;
    };
    reader.readAsDataURL(file);
  }

}
