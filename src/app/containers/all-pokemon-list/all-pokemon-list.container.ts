import { Component, signal } from '@angular/core';
import { SimplePokemon } from 'types/simple-pokemon.type';

import { HttpClient } from '@angular/common/http';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent],
    template: `
        <app-pokemon-list
            [pokemonList]="allPokemon()" 
            [nextPageUrl]="nextPageUrl" 
            (loadMoreRequest)="loadMorePokemons()" 
        /> 
    `,
})
export class AllPokemonListContainer {
    allPokemon = signal<SimplePokemon[]>([]);
    nextPageUrl = signal<string | null>(null);

    constructor(private http: HttpClient) {
      this.loadPokemons('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
    }
  
    loadPokemons(url: string) {
        this.http.get(url).subscribe((response: any) => {
          this.allPokemon.update((prevPokemons) => [...prevPokemons, ...response.results]);
          this.nextPageUrl.set(response.next);
        });
      }
    
      loadMorePokemons() {
        const url = this.nextPageUrl();

        if (url) {
          this.loadPokemons(url);
        }
      }
    }