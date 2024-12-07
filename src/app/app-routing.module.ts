import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './core/auth.guard';

// const routes: Routes = [
//   { path: '', component: HomeComponent },
//    { path: 'login', component: LoginComponent }
// ];
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'timeline', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
