import { RequestHandlerService } from './request-handler/request-handler.service';
import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        LoggerModule.forRoot(),
        HttpModule.register({
            timeout: 180000,
            maxRedirects: 5,
        }),],
    exports: [AppLogger, RequestHandlerService],
    controllers: [],
    providers: [AppLogger, RequestHandlerService],
})
export class AppConfigModule { }
