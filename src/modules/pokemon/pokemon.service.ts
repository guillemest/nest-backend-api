import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { parallel } from 'async';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager'
import {
    PokemonBasicDataDto,
    PokemonDto,
    PokemonEvolutionChain,
    PokemonListDto,
    Result,
    PokemonPaginationInfoDto,
    PokemonSpeciesDto,
    Specy,
    PokemonDetailDto,
    PokemonDetailReturnDto,
    PokemonEvolution
} from './dtos/index';

import { AppLogger } from './../../config/logger/logger.service';
import { RequestHandlerService } from './../../config/request-handler/request-handler.service';
@Injectable()
export class PokemonService {

    constructor(
        private readonly appLogger: AppLogger,
        private requestHandlerService: RequestHandlerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    getPokemonByIdName(param: number | string): Observable<PokemonDto> {
        return this.requestHandlerService.doGet(`pokemon/${param}`).pipe(
            map((axiosResponse: AxiosResponse) => {
                return axiosResponse.data as PokemonDto;
            })
        );
    }

    getPokemonEvolutionChain(id: number): Observable<PokemonEvolutionChain> {
        return this.requestHandlerService.doGet(`evolution-chain/${id}`).pipe(
            map((axiosResponse: AxiosResponse) => {
                return axiosResponse.data as PokemonEvolutionChain;
            })
        );
    }

    getPokemonSpecies(param: number | string): Observable<PokemonSpeciesDto> {
        return this.requestHandlerService.doGet(`pokemon-species/${param}`).pipe(
            map((axiosResponse: AxiosResponse) => {
                return axiosResponse.data as PokemonSpeciesDto;
            })
        );
    }


    async getPokemonList(offset: number, limit: number): Promise<PokemonListDto> {
        return await lastValueFrom(
            this.requestHandlerService
                .doGet(`pokemon/?offset=${offset}&limit=${limit}`)
                .pipe(map((axiosResponse: AxiosResponse) => axiosResponse.data as PokemonListDto),)
        );
    }

    async getPokemonDetailData(name: string): Promise<PokemonDetailReturnDto> {
        let currPokemonDetailData = await this.cacheManager.get('pokemonDetails') as PokemonDetailDto[];
        let currPokemonDetail = {} as PokemonDetailDto;
        let description: string;
        let evolution: PokemonEvolution[];


        if (currPokemonDetailData && currPokemonDetailData.length > 0) {
            currPokemonDetail = currPokemonDetailData.find(detailData => detailData.pokemonNames.includes(name))
            if (currPokemonDetail) {
                description = currPokemonDetail.pokemonDescription.find(data => data.name === name)?.description;
                if (!description) {
                    const specieData = await lastValueFrom(this.getPokemonSpecies(name))
                    description = specieData.flavor_text_entries
                        .filter(fl => fl.language.name == 'en')
                        .map(fl => fl.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' '))
                        .filter((curr, index, self) => {
                            return index === self.indexOf(curr);
                        })
                        .join('');

                    currPokemonDetail.pokemonDescription.push({
                        name,
                        description
                    });

                }
                evolution = currPokemonDetail.evolution;
            } else {
                const data = await this.updatePokemonDetailData(name, currPokemonDetailData);
                evolution = data.evolution;
                description = data.description;
            }
        } else {
            currPokemonDetailData = [];
            const data = await this.updatePokemonDetailData(name, currPokemonDetailData);
            evolution = data.evolution;
            description = data.description;
        }

        return {
            description,
            evolution
        };
    }

    async updatePokemonDetailData(
        name: string,
        currPokemonDetailData: PokemonDetailDto[]
    ): Promise<PokemonDetailReturnDto> {
        const currPokemonDetail = {} as PokemonDetailDto;
        currPokemonDetail.pokemonNames = [];
        currPokemonDetail.pokemonDescription = [];

        const specieData = await lastValueFrom(this.getPokemonSpecies(name));
        const description = specieData.flavor_text_entries
            .filter(fl => fl.language.name == 'en')
            .map(fl => fl.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' '))
            .filter((curr, index, self) => {
                return index === self.indexOf(curr);
            })
            .join('');

        currPokemonDetail.pokemonDescription.push({
            name,
            description
        });

        const evolutionId: number = +specieData.evolution_chain.url.split(/\//).filter(v => v).pop();
        currPokemonDetail.evolutionId = evolutionId;
        const evolution = await this.getEvolutionChain(
            await lastValueFrom(
                this.getPokemonEvolutionChain(evolutionId)
            ) as PokemonEvolutionChain
        );

        currPokemonDetail.evolution = evolution;
        currPokemonDetail.pokemonNames = currPokemonDetail.evolution.map(evo => evo.name);
        currPokemonDetailData.push(currPokemonDetail)
        await this.cacheManager.set('pokemonDetails', currPokemonDetailData, { ttl: 60000 });
        return {
            description,
            evolution: currPokemonDetail.evolution
        };
    }


    async getEvolutionChain(evolutionData: PokemonEvolutionChain): Promise<PokemonEvolution[]> {
        const result: PokemonEvolution[] = [];
        let evoData = evolutionData.chain;
        do {

            const res: PokemonDto = await lastValueFrom(
                this.getPokemonByIdName(evoData.species.name)
            );

            result.push({
                "name": evoData.species.name,
                "url": evoData.species.url,
                "image": res.sprites.front_default
            });

            evoData = evoData.evolves_to[0];
        } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

        return result
    }

    async getPokemonBasicData(data: Result[]): Promise<PokemonBasicDataDto[]> {
        return new Promise(async (resolve, reject) => {
            try {
                this.appLogger.log('getPokemonBasicDataDto IN');
                await parallel(
                    data.map((pokemon) => {
                        return async () => {
                            const res: PokemonDto = await lastValueFrom(
                                this.getPokemonByIdName(pokemon.name)
                            );


                            const PokemonBasicDataDto: PokemonBasicDataDto = {
                                id: res.id,
                                name: pokemon.name,
                                types: res.types,
                                weight: res.weight,
                                abilities: res.abilities,
                                sprite: res.sprites
                            }

                            delete res.sprites.other;
                            delete res.sprites.versions;

                            return PokemonBasicDataDto;
                        };
                    }),
                    (err, res) => {
                        this.appLogger.log('getPokemonBasicDataDto OUT');
                        if (err) {
                            return reject(err);
                        }

                        this.appLogger.log(`Process getAllPokemonBasicDataDto ended with a total of results: ${res.length}`);
                        resolve(res);
                    },
                );
            } catch (error) {
                this.appLogger.error(`Process failed: ${JSON.stringify(error)}`);
                reject(error);
            }
        });
    }

    async getAllPokemons(offset: number, limit: number): Promise<PokemonPaginationInfoDto> {
        const currLimit = await this.cacheManager.get('pokemonDataLimit') as number;
        let pokemonPaginationInfo = {} as PokemonPaginationInfoDto;
        pokemonPaginationInfo.limit = !currLimit ? limit : currLimit;
        const currPokemonPaginationInfo = await this.cacheManager.get('pokemonPaginationInfo') as PokemonPaginationInfoDto;

        if (!currPokemonPaginationInfo && currLimit !== limit) {
            const pokemonData = await this.getPokemonList(offset, limit);
            const data = await this.getPokemonBasicData(pokemonData.results);
            pokemonPaginationInfo.data = data;
            pokemonPaginationInfo.count = pokemonData.count;

            if (pokemonData.next) {
                pokemonPaginationInfo.next = +this.getUrlParam(pokemonData.next, 'offset');
            }

            if (pokemonData.previous) {
                pokemonPaginationInfo.previous = +this.getUrlParam(pokemonData.previous, 'offset');
            }

            await this.cacheManager.set('pokemonDataLimit', pokemonPaginationInfo.limit, { ttl: 60000 });
            await this.cacheManager.set('pokemonPaginationInfo', pokemonPaginationInfo, { ttl: 60000 });
        } else {

            const currData = currPokemonPaginationInfo.data;

            if (offset === currPokemonPaginationInfo.next && limit === currPokemonPaginationInfo.limit) {
                const pokemonData = await this.getPokemonList(offset, limit);
                const data = await this.getPokemonBasicData(pokemonData.results);
                pokemonPaginationInfo.data = currData && currData.length > 0 ? data.concat(currData).sort((pokemonA, pokemonB) => pokemonA.id - pokemonB.id) : data;
                pokemonPaginationInfo.count = pokemonData.count;

                if (pokemonData.next) {
                    pokemonPaginationInfo.next = +this.getUrlParam(pokemonData.next, 'offset');
                }

                if (pokemonData.previous) {
                    pokemonPaginationInfo.previous = +this.getUrlParam(pokemonData.previous, 'offset');
                }

                await this.cacheManager.set('pokemonPaginationInfo', pokemonPaginationInfo, { ttl: 60000 });

            } else if (offset < currPokemonPaginationInfo.next) {

                pokemonPaginationInfo = Object.assign(pokemonPaginationInfo, currPokemonPaginationInfo);
                const end = limit > pokemonPaginationInfo.limit ? limit : limit === offset ? pokemonPaginationInfo.next : limit;
                pokemonPaginationInfo.data = currData.slice(offset, end);
                pokemonPaginationInfo.next = currPokemonPaginationInfo.next;
                pokemonPaginationInfo.previous = currPokemonPaginationInfo.previous;
                if (pokemonPaginationInfo.next === pokemonPaginationInfo.limit &&
                    limit === currPokemonPaginationInfo.limit
                ) {
                    delete pokemonPaginationInfo.previous
                }
            }
        }

        return pokemonPaginationInfo

    }

    getUrlParam(url: string, paramName: string): string {
        const urlObj = new URL(url);
        return urlObj.searchParams.get(paramName);
    }

}
