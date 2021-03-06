import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

import { AuthModule } from './auth.module';
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AuthRoutingModule { }
