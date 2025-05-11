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

                            @if (currentPokemonInfo?.data()) {
                                <div>
                                    <span class="font-extrabold">{{ currentPokemonInfo.data().name | titlecase }}</span>&nbsp;-
                                    <span *ngIf="currentPokemonInfo.data().height < 5; else midRangeHeight">
                                        Short King/Queen vibes! Standing tall at just <span class="font-extrabold text-red-500">{{ currentPokemonInfo.data().height * 10 }}cm</span>.
                                    </span>
                                </div>
                            }
                                
                            <p>Abilities:</p>
                            <ul class="list-disc pl-5">
                                @for (ability of currentPokemonInfo?.data()?.['abilities']; let index = $index; track index) {
                                    <li>
                                        {{ ability?.ability?.name | titlecase}}
                                    </li>
                                }
                            </ul>
                    }
                    
                     @case (2) {
                        <p><span class="font-bold">{{ currentPokemonInfo?.data()?.name | titlecase }}</span> has the next stats:</p>
                        <ul class="list-disc pl-5">
                            @for (stat of currentPokemonInfo?.data()?.['stats']; let index = $index; track index) {
                                <li>
                                    <span>
                                        {{stat.stat.name | titlecase}}: 
                                        <span class="font-extrabold" [ngClass]="{
                                            'text-red-500': stat.base_stat < 40,
                                            'text-yellow-500': stat.base_stat >= 40 && stat.base_stat < 60,
                                            'text-green-500': stat.base_stat >= 60
                                        }">
                                            {{ stat.base_stat }}
                                        </span>
                                    </span>
                                </li>
                            }
                        </ul>
                    }

                    @case (3) {
                        <p><span class="font-bold">{{ currentPokemonInfo?.data()?.name | titlecase }}</span> has the next type(s):</p>
                        <ul class="list-disc pl-5">
                            @for (type of currentPokemonInfo?.data()?.['types']; let index = $index; track index) {
                                <li>
                                    <span>{{type.type.name | titlecase}}</span>
                                </li>
                            }
                        </ul>
                    }
                }
            </div>

        </div>

        <!-- Templates for abilities range -->
        <ng-template #midRangeHeight>
            <span *ngIf="currentPokemonInfo.data().height >= 5 && currentPokemonInfo.data().height < 10; else tallHeight">
                Not too tall, not too short... just right - <span class="font-extrabold text-yellow-500">{{ currentPokemonInfo.data().height * 10 }}cm</span> of greatness!
            </span>
        </ng-template>

        <ng-template #tallHeight>
            <span *ngIf="currentPokemonInfo.data().height >= 10 && currentPokemonInfo.data().height < 20; else gigantamaxHeight">
                When you're taller than a skyscraper! <span class="font-extrabold text-green-500">{{ currentPokemonInfo.data().height * 10 }}cm</span> of towering power!
            </span>
        </ng-template>

        <ng-template #gigantamaxHeight>
            <span *ngIf="currentPokemonInfo.data().height >= 20">
                Going BIG or going home! <span class="font-extrabold text-fuchsia-500">{{ currentPokemonInfo.data().height * 10 }}cm</span> of Gigantamax glory!
            </span>
        </ng-template>
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
                // Set activeTabIndex to '1' when selecting a new Pokemon
                // this.activeTabIndex = 1; 
            }
        });
    }

    setActiveTabIndex(tabIndex: number) {
        this.activeTabIndex = tabIndex;
    }
}
