import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Router } from '@angular/router';

// Interface
export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  date: Date;
  status: string;
  nbLikes: number;
}

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {

  search: string = '';
  favorites: Suggestion[] = [];
  suggestions: Suggestion[] = [];

  // Reactive Form
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

  constructor(
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });

    // Charger toutes les suggestions
    this.loadSuggestions();
  }

  // Méthode pour rafraîchir la liste
  loadSuggestions() {
    this.suggestionService.getSuggestionsList().subscribe(list => {
      this.suggestions = list || [];
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

      // Ajouter suggestion et rafraîchir la liste
      this.suggestionService.addSuggestion(newSuggestion).subscribe(() => {
        this.loadSuggestions();
        this.suggestionForm.reset();
        this.suggestionForm.patchValue({
          date: new Date().toLocaleDateString(),
          status: 'en attente'
        });
      });
    }
  }

  incrementLike(s: Suggestion) {
    this.suggestionService.incrementLikes(s.id).subscribe(updated => {
      if (updated) {
        // Mettre à jour uniquement le nbLikes de l'élément concerné
        const index = this.suggestions.findIndex(item => item.id === s.id);
        if (index !== -1) {
          this.suggestions[index].nbLikes = updated.nbLikes;
        }
      }
    });
  }

  addToFavorites(s: Suggestion) {
    if (!this.favorites.includes(s)) {
      this.favorites.push(s);
      alert("Ajouté aux favoris !");
    }
  }

  get filteredSuggestions() {
    return this.suggestions.filter(s =>
      s.title.toLowerCase().includes(this.search.toLowerCase()) ||
      s.category.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  deleteSuggestion(id: number) {
    this.suggestionService.deleteSuggestion(id).subscribe(() => {
      this.suggestions = this.suggestions.filter(s => s.id !== id);
    });
  }
}
