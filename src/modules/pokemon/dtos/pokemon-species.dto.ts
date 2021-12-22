export interface Growth_rate {
	name: string;
	url: string;
}

export interface Pokedex {
	name: string;
	url: string;
}

export interface Pokedex_number {
	entry_number: number;
	pokedex: Pokedex;
}

export interface Egg_group {
	name: string;
	url: string;
}

export interface Color {
	name: string;
	url: string;
}

export interface Shape {
	name: string;
	url: string;
}

export interface Evolves_from_specy {
	name: string;
	url: string;
}

export interface Evolution_chain {
	url: string;
}

export interface Generation {
	name: string;
	url: string;
}

export interface Language {
	name: string;
	url: string;
}

export interface Name {
	name: string;
	language: Language;
}

export interface Language {
	name: string;
	url: string;
}

export interface Version {
	name: string;
	url: string;
}

export interface Flavor_text_entry {
	flavor_text: string;
	language: Language;
	version: Version;
}

export interface Language {
	name: string;
	url: string;
}

export interface Form_description {
	description: string;
	language: Language;
}

export interface Genera {
	genus: string;
	language: Language;
}

export interface Pokemon {
	name: string;
	url: string;
}

export interface Variety {
	is_default: boolean;
	pokemon: Pokemon;
}

export interface PokemonSpeciesDto {
	id: number;
	name: string;
	order: number;
	gender_rate: number;
	capture_rate: number;
	base_happiness: number;
	is_baby: boolean;
	is_legendary: boolean;
	is_mythical: boolean;
	hatch_counter: number;
	has_gender_differences: boolean;
	forms_switchable: boolean;
	growth_rate: Growth_rate;
	pokedex_numbers: Pokedex_number[];
	egg_groups: Egg_group[];
	color: Color;
	shape: Shape;
	evolves_from_species: Evolves_from_specy;
	evolution_chain: Evolution_chain;
	habitat?: any;
	generation: Generation;
	names: Name[];
	flavor_text_entries: Flavor_text_entry[];
	form_descriptions: Form_description[];
	genera: Genera[];
	varieties: Variety[];
}