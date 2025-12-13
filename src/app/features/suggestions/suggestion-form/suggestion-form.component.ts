import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Suggestion } from '../list-suggestion/list-suggestion.component';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  id!: number | null;
  isUpdate: boolean = false;

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
    private router: Router,
    private actR: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.id = this.actR.snapshot.params['id'] || null;

    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });

    // Si on est en mode update, préremplir le formulaire
    if (this.id) {
      this.isUpdate = true;
      this.suggestionService.getSuggestionById(this.id).subscribe(s => {
        if (s) {
          this.suggestionForm.patchValue(s);
        }
      });
    }
  }

  submit(): void {
    if (this.suggestionForm.valid) {
      const suggestionData: Suggestion = {
        id: this.id || Date.now(),
        ...this.suggestionForm.getRawValue(),
        date: new Date(),
        status: this.suggestionForm.getRawValue().status || 'en attente',
        nbLikes: this.isUpdate && this.id ? this.suggestionForm.getRawValue().nbLikes || 0 : 0
      };

      if (this.isUpdate) {
        this.suggestionService.updateSuggestion(suggestionData).subscribe(() => {
          alert('Suggestion mise à jour !');
          this.router.navigate(['/listSuggestion']);
        });
      } else {
        this.suggestionService.addSuggestion(suggestionData).subscribe(() => {
          alert('Nouvelle suggestion ajoutée !');
          this.router.navigate(['/listSuggestion']);
        });
      }
    }
  }
}
