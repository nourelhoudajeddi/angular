import { Injectable } from '@angular/core';
import { Suggestion } from '../../features/suggestions/list-suggestion/list-suggestion.component';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private suggestionList: Suggestion[] = [
    { id: 1, title: 'Organiser une journée team building', description: '...', category: 'Événements', date: new Date('2025-01-20'), status: 'acceptee', nbLikes: 0 },
    { id: 2, title: 'Améliorer le système de réservation', description: '...', category: 'Technologie', date: new Date('2025-01-15'), status: 'refusee', nbLikes: 0 },
    { id: 3, title: 'Créer un système de récompenses', description: '...', category: 'Ressources Humaines', date: new Date('2025-01-25'), status: 'refusee', nbLikes: 0 },
    { id: 4, title: 'Moderniser l\'interface utilisateur', description: '...', category: 'Technologie', date: new Date('2025-01-30'), status: 'en_attente', nbLikes: 0 },
    { id: 5, title: 'Formation à la sécurité informatique', description: '...', category: 'Formation', date: new Date('2025-02-05'), status: 'acceptee', nbLikes: 0 }
  ];

  private suggestionUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient) { }

  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.suggestionUrl).pipe(
      tap(list => {
        this.suggestionList = list;
      }),
      catchError(_ => of(this.suggestionList)) // si backend HS, retourner local
    );
  }

  getLocalSuggestions(): Observable<Suggestion[]> {
    return of(this.suggestionList);
  }

  getSuggestionById(id: number): Observable<Suggestion | undefined> {
    const local = this.suggestionList.find(s => s.id === id);
    if (local) return of(local);
    return this.http.get<Suggestion>(`${this.suggestionUrl}/${id}`).pipe(
      catchError(_ => of(undefined))
    );
  }

  addSuggestion(s: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, s).pipe(
      tap(newS => this.suggestionList.push(newS)),
      catchError(_ => {
        // si backend HS, ajout local seulement
        this.suggestionList.push(s);
        return of(s);
      })
    );
  }

  updateSuggestion(s: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${s.id}`, s).pipe(
      tap(updated => {
        const index = this.suggestionList.findIndex(x => x.id === updated.id);
        if (index !== -1) this.suggestionList[index] = updated;
      }),
      catchError(_ => {
        const index = this.suggestionList.findIndex(x => x.id === s.id);
        if (index !== -1) this.suggestionList[index] = s;
        return of(s);
      })
    );
  }

  deleteSuggestion(id: number): Observable<any> {
    return this.http.delete(`${this.suggestionUrl}/${id}`).pipe(
      tap(() => {
        this.suggestionList = this.suggestionList.filter(s => s.id !== id);
      }),
      catchError(_ => {
        this.suggestionList = this.suggestionList.filter(s => s.id !== id);
        return of(null);
      })
    );
  }

 incrementLikes(id: number): Observable<Suggestion> {
  const suggestion = this.suggestionList.find(s => s.id === id);
  if (!suggestion) return of(undefined as any);

  suggestion.nbLikes += 1;

  this.http.put<Suggestion>(`${this.suggestionUrl}/${suggestion.id}`, suggestion)
    .pipe(catchError(_ => of(suggestion)))
    .subscribe();

  return of(suggestion); }

}
