

export interface PokemonDetailDto {
    evolutionId: number;
    evolution: PokemonEvolution[]
    pokemonNames: string[];
    pokemonDescription: PokemonDescriptionDto[]
}

export interface PokemonDescriptionDto {
    name: string;
    description: string;
}

export interface PokemonEvolution {
    name: string;
	url: string;
    image: string;
}

export interface PokemonDetailReturnDto{
    description: string;
    evolution: PokemonEvolution[]
}