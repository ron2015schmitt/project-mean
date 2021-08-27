import { Component } from "@angular/core";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})

export class PostCreateComponent {
  newPost = 'NO CONTENT';
  userValue = '';
  onAddPost() {
    console.log(this.userValue);
    this.newPost = this.userValue;
  }
}
