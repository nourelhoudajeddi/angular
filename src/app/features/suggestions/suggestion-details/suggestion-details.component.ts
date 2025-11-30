import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { ListSuggestionComponent } from '../list-suggestion/list-suggestion.component';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion!: Suggestion | undefined;

  // On crée une instance temporaire pour accéder au tableau de suggestions
  listComp = new ListSuggestionComponent();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.suggestion = this.listComp.suggestions.find(s => s.id === id);
  }
}
