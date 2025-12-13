import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../list-suggestion/list-suggestion.component';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.css']
})
export class AddSuggestionComponent implements OnInit {

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
    private suggestionService: SuggestionService,
    private router: Router,
    private actR: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.actR.snapshot.params['id'] || null;

    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category: ['', Validators.required],
      date: [{ value: new Date().toLocaleDateString(), disabled: true }],
      status: [{ value: 'en attente', disabled: true }]
    });

    if (this.id) {
      this.isUpdate = true;
      this.suggestionService.getSuggestionById(this.id).subscribe((data) => {
        if (data) {
          this.suggestionForm.patchValue(data);
        }
      });
    }
  }

  save(): void {
    if (this.suggestionForm.valid) {
      const suggestionData: Suggestion = {
        id: this.id || Date.now(),
        ...this.suggestionForm.getRawValue(),
        date: new Date(),
        status: this.suggestionForm.getRawValue().status || 'en attente',
        nbLikes: this.isUpdate && this.id ? this.suggestionForm.getRawValue().nbLikes || 0 : 0
      };

      if (this.isUpdate) {
        // ✅ On s'abonne pour exécuter la requête
        this.suggestionService.updateSuggestion(suggestionData).subscribe(() => {
          this.router.navigate(['/listSuggestion']);
        });
      } else {
        this.suggestionService.addSuggestion(suggestionData).subscribe(() => {
          this.router.navigate(['/listSuggestion']);
        });
      }
    }
  }
}
