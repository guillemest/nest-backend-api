
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Configuration } from './../config.enum';

@Injectable()
export class RequestHandlerService {
    private baseUrl: string;
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get(Configuration.POKEMON_API_URL)
    }

    doGet(url): Observable<AxiosResponse<any>> {
        const requestUrl = this.baseUrl + url;
        return this.httpService.get(requestUrl, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).pipe(catchError(e => {
            throw new HttpException(e.response.data, e.response.status);
        }));
    }
}
