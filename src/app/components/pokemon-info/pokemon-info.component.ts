import { Component, input } from '@angular/core';
import { Pokemon } from 'types/pokemon.type';

import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [TypewriterComponent],
    template: `
        <app-typewriter [text]="pokemonInfo()?.name" />

        <div class="sprite-wrapper absolute top-0 right-0 w-[96px] h-[96px]">
            @if (pokemonInfo(); as pokemonInfo) {
                <div
                    class="sprite w-full h-full bg-center bg-contain filter grayscale brightness-[1.5]"
                    [style.background-image]="'url(' + pokemonInfo.sprites['front_default'] + ')'"
                ></div>
            }
        </div>
    `,
    styleUrl: './pokemon-info.component.scss',
})
export class PokemonInfoComponent {
    readonly pokemonInfo = input<Pokemon>();
}
