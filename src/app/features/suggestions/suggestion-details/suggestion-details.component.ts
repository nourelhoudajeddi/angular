import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../list-suggestion/list-suggestion.component';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion!: Suggestion | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Récupérer depuis le service (backend + local)
    this.suggestionService.getSuggestionById(id).subscribe(s => {
      if (s) {
        this.suggestion = s;
      } else {
        alert("Suggestion non trouvée !");
        this.router.navigate(['/listSuggestion']);
      }
    });
  }

  // Supprimer la suggestion et revenir à la liste
  deleteSuggestion(): void {
    if (this.suggestion) {
      this.suggestionService.deleteSuggestion(this.suggestion.id).subscribe(() => {
        alert("Suggestion supprimée !");
        this.router.navigate(['/listSuggestion']);
      });
    }
  }

  // Naviguer vers le formulaire de mise à jour
  updateSuggestion(): void {
    if (this.suggestion) {
      this.router.navigate(['/add-suggestion', this.suggestion.id]);
    }
  }
}
