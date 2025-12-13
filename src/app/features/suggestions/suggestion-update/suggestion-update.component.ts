import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/Services/suggestion.service';
import { Suggestion } from '../list-suggestion/list-suggestion.component';

@Component({
  selector: 'app-suggestion-update',
  templateUrl: './suggestion-update.component.html',
  styleUrls: ['./suggestion-update.component.css']
})
export class SuggestionUpdateComponent implements OnInit {

  suggestionForm!: FormGroup;
  suggestionId!: number;
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
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.suggestionId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialiser le formulaire
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      nbLikes: [{ value: 0, disabled: true }]
    });

    // Charger la suggestion existante
    this.suggestionService.getSuggestionById(this.suggestionId).subscribe(s => {
      if (s) {
        this.suggestionForm.patchValue({
          title: s.title,
          description: s.description,
          category: s.category,
          date: s.date,
          status: s.status,
          nbLikes: s.nbLikes
        });
      }
    });
  }

  updateSuggestion() {
    if (this.suggestionForm.valid) {
      const updatedSuggestion: Suggestion = {
        id: this.suggestionId,
        ...this.suggestionForm.getRawValue()
      };

      this.suggestionService.updateSuggestion(updatedSuggestion).subscribe(() => {
        alert('Suggestion mise à jour avec succès !');
        this.router.navigate(['/listSuggestion']);
      });
    }
  }
}
