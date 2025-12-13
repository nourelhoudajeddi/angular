import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUGGESTIONS, Suggestion } from '../list-suggestion/list-suggestion.component';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });
  }

  submit(): void {
    if (this.suggestionForm.valid) {
      const newSuggestion: Suggestion = {
        id: Date.now(),
        ...this.suggestionForm.getRawValue(),
        date: new Date(),
        status: 'en attente',
        nbLikes: 0
      };

      // On ajoute la suggestion directement dans le tableau global de list-suggestion
      SUGGESTIONS.push(newSuggestion);

      // Redirection vers la liste
      this.router.navigate(['/listSuggestion']);
    }
  }
}
