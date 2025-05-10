import { Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { SimplePokemon } from 'types/simple-pokemon.type';
import { PokemonListItemComponent } from '../pokemon-list-item/pokemon-list-item.component';

@Component({
    selector: 'app-pokemon-list',
    template: `
        <header>
            <nav>
                <button class="big-button blue"></button>
            </nav>
            <div class="nav-shadow"></div>

            <div class="top-bar">
                <button class="small-button red"></button>
                <button class="small-button yellow"></button>
                <button class="small-button green"></button>
            </div>
        </header>

        <div class="section-wrapper">
            <section>
                @for (pokemon of pokemonList(); let index = $index; track pokemon.name) {
                    <app-pokemon-list-item [index]="$index" [pokemon]="pokemon" />
                }
                @if (nextPageUrl) {
                    <button (click)="loadMore()" class="p-2 rounded-md bg-cyan-500 font-semibold">
                        Load more Pokemons
                    </button>
                } @else {
                    <div class="text-center p-2 font-semibold">
                        No more Pokemons ...
                    </div>
                 }
                
            </section>
        </div>

        <footer></footer>
    `,
    styleUrl: './pokemon-list.component.scss',
    imports: [PokemonListItemComponent],
})
export class PokemonListComponent {
    readonly pokemonList = input<SimplePokemon[]>([]);

    @Input() nextPageUrl = signal<string | null>(null);
    @Output() loadMoreRequest = new EventEmitter<void>();
    
    loadMore() {
        this.loadMoreRequest.emit();
    }

  }