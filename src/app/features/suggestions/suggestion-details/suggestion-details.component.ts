import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SUGGESTIONS, Suggestion } from '../list-suggestion/list-suggestion.component';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion!: Suggestion | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Utilisation directe de SUGGESTIONS
    this.suggestion = SUGGESTIONS.find(s => s.id === id);
  }
}
