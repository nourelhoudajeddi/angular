import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

// Export du tableau de suggestions pour pouvoir l'importer dans un autre composant
export const SUGGESTIONS: Suggestion[] = [
  {
    id: 1,
    title: 'Organiser une journée team building',
    description: 'Suggestion pour organiser une journée de team building pour renforcer les liens entre les membres de l\'équipe.',
    category: 'Événements',
    date: new Date('2025-01-20'),
    status: 'acceptee',
    nbLikes: 0
  },
  {
    id: 2,
    title: 'Améliorer le système de réservation',
    description: 'Proposition pour améliorer la gestion des réservations en ligne avec un système de confirmation automatique.',
    category: 'Technologie',
    date: new Date('2025-01-15'),
    status: 'refusee',
    nbLikes: 0
  },
  {
    id: 3,
    title: 'Créer un système de récompenses',
    description: 'Mise en place d\'un programme de récompenses pour motiver les employés et reconnaître leurs efforts.',
    category: 'Ressources Humaines',
    date: new Date('2025-01-25'),
    status: 'refusee',
    nbLikes: 0
  },
  {
    id: 4,
    title: 'Moderniser l\'interface utilisateur',
    description: 'Refonte complète de l\'interface utilisateur pour une meilleure expérience utilisateur.',
    category: 'Technologie',
    date: new Date('2025-01-30'),
    status: 'en_attente',
    nbLikes: 0
  },
  {
    id: 5,
    title: 'Formation à la sécurité informatique',
    description: 'Organisation d\'une formation sur les bonnes pratiques de sécurité informatique pour tous les employés.',
    category: 'Formation',
    date: new Date('2025-02-05'),
    status: 'acceptee',
    nbLikes: 0
  }
];

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css']
})
export class ListSuggestionComponent implements OnInit {

  search: string = '';
  favorites: Suggestion[] = [];

  // Utilisation du tableau exporté
  suggestions = SUGGESTIONS;

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });
  }

  // Ajouter une nouvelle suggestion
  submit(): void {
    if (this.suggestionForm.valid) {
      const newSuggestion: Suggestion = {
        id: Date.now(), // auto-incrément simulé
        ...this.suggestionForm.getRawValue(),
        date: new Date(),
        status: 'en attente',
        nbLikes: 0
      };

      this.suggestions.push(newSuggestion);

      // Réinitialiser le formulaire
      this.suggestionForm.reset();
      this.suggestionForm.patchValue({
        date: new Date().toLocaleDateString(),
        status: 'en attente'
      });
    }
  }

  incrementLike(s: Suggestion) {
    s.nbLikes++;
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
}
