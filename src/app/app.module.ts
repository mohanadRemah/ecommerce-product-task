import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductCardComponent} from './features/products/product-card/product-card.component';
import {LoginComponent} from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ProductCardComponent,
    HomeComponent,
    CategoriesComponent,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
