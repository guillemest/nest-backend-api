import { Ability, Type, Sprite } from "./pokemon.dto";

export interface PokemonBasicDataDto {
    id: number;
    name: string;
    types: Type[];
    weight: number,
    abilities: Ability[];
    sprite: Sprite
}