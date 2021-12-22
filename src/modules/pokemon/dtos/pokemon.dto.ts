export interface Ability {
	name: string;
	url: string;
}

export interface Ability {
	ability: Ability;
	is_hidden: boolean;
	slot: number;
}

export interface Form {
	name: string;
	url: string;
}

export interface Version {
	name: string;
	url: string;
}

export interface Game_indice {
	game_index: number;
	version: Version;
}

export interface Move {
	name: string;
	url: string;
}

export interface Move_learn_method {
	name: string;
	url: string;
}

export interface Version_group {
	name: string;
	url: string;
}

export interface Version_group_detail {
	level_learned_at: number;
	move_learn_method: Move_learn_method;
	version_group: Version_group;
}

export interface Move {
	move: Move;
	version_group_details: Version_group_detail[];
}

export interface Specy {
	name: string;
	url: string;
}

export interface Dream_world {
	front_default: string;
	front_female?: any;
}

export interface Home {
	front_default: string;
	front_female?: any;
	front_shiny: string;
	front_shiny_female?: any;
}

export interface Yellow {
	back_default: string;
	back_gray: string;
	back_transparent: string;
	front_default: string;
	front_gray: string;
	front_transparent: string;
}

export interface Crystal {
	back_default: string;
	back_shiny: string;
	back_shiny_transparent: string;
	back_transparent: string;
	front_default: string;
	front_shiny: string;
	front_shiny_transparent: string;
	front_transparent: string;
}

export interface Gold {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
	front_transparent: string;
}

export interface Silver {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
	front_transparent: string;
}

export interface Emerald {
	front_default: string;
	front_shiny: string;
}


export interface Platinum {
	back_default: string;
	back_female?: any;
	back_shiny: string;
	back_shiny_female?: any;
	front_default: string;
	front_female?: any;
	front_shiny: string;
	front_shiny_female?: any;
}

export interface Animated {
	back_default: string;
	back_female?: any;
	back_shiny: string;
	back_shiny_female?: any;
	front_default: string;
	front_female?: any;
	front_shiny: string;
	front_shiny_female?: any;
}

export interface Icon {
	front_default: string;
	front_female?: any;
}

export interface Icon {
	front_default: string;
	front_female?: any;
}

export interface Sprite {
	back_default: string;
	back_female?: any;
	back_shiny: string;
	back_shiny_female?: any;
	front_default: string;
	front_female?: any;
	front_shiny: string;
	front_shiny_female?: any;
	other: any;
	versions: Version;
}

export interface Stat {
	name: string;
	url: string;
}

export interface Stat {
	base_stat: number;
	effort: number;
	stat: Stat;
}

export interface Type {
	name: string;
	url: string;
}

export interface Type {
	slot: number;
	type: Type;
}

export interface PokemonDto {
	abilities: Ability[];
	base_experience: number;
	forms: Form[];
	game_indices: Game_indice[];
	height: number;
	held_items: any[];
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: Move[];
	name: string;
	order: number;
	past_types: any[];
	species: Specy;
	sprites: Sprite;
	stats: Stat[];
	types: Type[];
	weight: number;
}