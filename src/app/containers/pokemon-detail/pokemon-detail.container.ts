import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from 'types/pokemon.type';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent, CommonModule],
    template: `
        <div class="w-full bg-black text-white h-60 p-2 rounded-md shadow-inner">
            @if (currentPokemonInfo.data(); as pokemonInfo) {
                <app-pokemon-info [pokemonInfo]="pokemonInfo" />
            }
        </div>

        <!-- 
            TODO: make these tabs do something 
            - Look at https://github.com/Gabb-c/pokenode-ts and use data (+ types) from one of these endpoints
            - Implement something like moves, abilities, stats, ... whatever you think is cool
            - Be creative, do something you like
        -->
        <div class="flex flex-row *:flex-auto gap-2">
            <!-- Q: Should these become a separate button/tab component? Maybe use existing lib? -->
            <button class="bg-cyan-300 p-2 rounded-md" [class.bg-cyan-500]="activeTabIndex === 1" (click)="setActiveTabIndex(1)">Abilities</button>
            <button class="bg-cyan-300 p-2 rounded-md" [class.bg-cyan-500]="activeTabIndex === 2" (click)="setActiveTabIndex(2)">Stats</button>
            <button class="bg-cyan-300 p-2 rounded-md" [class.bg-cyan-500]="activeTabIndex === 3" (click)="setActiveTabIndex(3)">Types</button>
        </div>

        <div class="grow bg-gray-200 p-2 rounded-md">
            <div class="grow bg-gray-200 p-2 rounded-md">
                @switch (activeTabIndex) {
                    @case (1) {
                        Content for tab 1 goes here
                    }
                    
                    @case (2) {
                        content for tab 2 goes here
                    }

                    @case (3) {
                        Content for Tab 3 goes here
                    }
                }
            </div>
        </div>
    `,
})
export class PokemonDetailContainer {
    private readonly httpClient = inject(HttpClient);
    private readonly pokemonId = signal('bulbasaur');

    activeTabIndex: number = 1;
    pokemonName = '';
    pokemonAbilities = [];

    readonly currentPokemonInfo = injectQuery(() => ({
        queryKey: ['pokemon', this.pokemonId()],
        queryFn: () =>
            // TODO: use https://github.com/PokeAPI/pokeapi-js-wrapper instead?
            firstValueFrom(this.httpClient.get<Pokemon>(`/api/v2/pokemon/${this.pokemonId()}`)),
    }));

    constructor(private route: ActivatedRoute) {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20');
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const pokemonName = params['pokemonId'];
            if (pokemonName) {
                this.pokemonId.set(pokemonName);
            }
        });
    }

    setActiveTabIndex(tabIndex: number) {
        this.activeTabIndex = tabIndex;
    }
}
