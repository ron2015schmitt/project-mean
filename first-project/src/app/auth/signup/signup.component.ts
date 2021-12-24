import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  isLoading = false;

  constructor(
    public authService: AuthService,
  ) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe( authStatus => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
