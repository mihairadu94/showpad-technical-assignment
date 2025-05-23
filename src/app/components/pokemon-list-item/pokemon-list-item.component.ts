import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SimplePokemon } from 'types/simple-pokemon.type';

@Component({
    selector: 'app-pokemon-list-item',
    template: `
        <a [routerLink]="['', { outlets: { detail: [pokemon().name] } }]" routerLinkActive="bg-blue-500" class="block p-2 rounded text-white no-underline hover:bg-[rgba(200,200,200,0.3)]">
            {{ index() + 1 }}
            {{ pokemon().name | uppercase }}
        </a>
    `,
    styleUrl: './pokemon-list-item.component.scss',
    imports: [RouterLink, RouterModule, UpperCasePipe],
})
export class PokemonListItemComponent {
    readonly index = input.required<number>();
    readonly pokemon = input.required<SimplePokemon>();
}
