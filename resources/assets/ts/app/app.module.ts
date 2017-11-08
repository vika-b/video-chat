import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login-page/login.component';
import { RegisterComponent } from './register-page/register.component';
import { HomepageComponent  } from './pages/homepage/homepage.component';
import { VideoChatComponent  } from './pages/video-chat/video.chat.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'video-chat', component: VideoChatComponent },
    { path: '', component: HomepageComponent, canActivate: [ AuthGuard ] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        ReactiveFormsModule,
        HttpModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomepageComponent,
        RegisterComponent,
        VideoChatComponent
    ],
    providers: [
        AuthenticationService,
        AuthGuard
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }