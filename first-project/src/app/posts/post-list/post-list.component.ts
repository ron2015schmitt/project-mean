import { Component } from "@angular/core";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})

export class PostListComponent {
  posts = [
    { title: 'hello', content: 'This is the hello message.'},
    { title: "what's up?", content: 'How is everyone?'},
    { title: 'looking for an apartment', content: 'I need an apartment in Brooklyn, NY.'},
  ];
}

