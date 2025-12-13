import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SuggestionsComponent } from './suggestions.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // <-- ajouter ça



@NgModule({
  declarations: [
    SuggestionsComponent,
    SuggestionDetailsComponent,
    SuggestionFormComponent,
    

  ],
  imports: [
    CommonModule,
    SuggestionsRoutingModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class SuggestionsModule { }
