import { Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { SimplePokemon } from 'types/simple-pokemon.type';
import { PokemonListItemComponent } from '../pokemon-list-item/pokemon-list-item.component';

@Component({
    selector: 'app-pokemon-list',
    template: `
        <header class="relative flex flex-row items-start z-20">
            <nav class="z-20 flex flex-row bg-[#d71f06] px-[64px] py-[32px] pl-[30px] rounded-tl-[16px] rounded-br-[16px]" style="clip-path: polygon(100% 0, 100% 5rem, 6rem 100%, 0 100%, 0 0);">
                <div class="h-[60px] w-[60px] rounded-full border-[4px] border-white shadow-[0_0_8px_2px_rgba(0,0,0,0.1)] bg-[radial-gradient(#9af0ff,_#12b2d6)]"></div>
            </nav>
            <div class="absolute left-0 bottom-0 w-6 z-10 shadow-[4px_4px_8px_4px_rgba(0,0,0,0.5)]"></div>

            <div class="flex flex-grow h-[80px] py-[20px] -ml-4 z-20 shadow-[32px_8px_8px_0_rgba(0,0,0,0.5)]" style="background: linear-gradient(133deg, rgba(215,31,6,1) 0%, rgba(215,31,6,1) 40%, rgba(226,88,70,1) 60%, rgba(215,31,6,1) 100%);">
                <button class="h-[12px] w-[12px] rounded-full mx-1 border border-[rgba(0,0,0,0.1)] bg-[radial-gradient(#da181f,_#b90a0a)]"></button>
                <button class="h-[12px] w-[12px] rounded-full mx-1 border border-[rgba(0,0,0,0.1)] bg-[radial-gradient(#ffdc26,_#f3b438)]"></button>
                <button class="h-[12px] w-[12px] rounded-full mx-1 border border-[rgba(0,0,0,0.1)] bg-[radial-gradient(#b0fb7b,_#50fb05)]"></button>
            </div>
        </header>

        <div class="flex grow mt-[-48px] px-8 pb-8 bg-[#d71f06] rounded-bl-[32px]" style="max-height: calc(100% - 76px);">
            <section class="flex flex-col bg-black text-white grow overflow-auto px-2 pt-12 pb-2 shadow-inner rounded-[32px] rounded-bl-[16px] rounded-tr-none">
                @for (pokemon of pokemonList(); let index = $index; track pokemon.name) {
                    <app-pokemon-list-item [index]="$index" [pokemon]="pokemon" />
                }
                @if (nextPageUrl) {
                    <button (click)="loadMore()" class="p-2 rounded-md bg-cyan-500 font-semibold mt-3 mb-2">
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