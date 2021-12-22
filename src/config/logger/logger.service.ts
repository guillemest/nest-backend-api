import { LoggerService, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLogger implements LoggerService {
    constructor(private readonly pinoLogger: PinoLogger) {
        pinoLogger.setContext(AppLogger.name);
    }

    log(message: any) {
        return this.pinoLogger.info(message);
    }

    error(message: any): any {
        return this.pinoLogger.error(message);
    }

    warn(message): any {
        return this.pinoLogger.warn(message);
    }

    debug(message: any): any {
        return this.pinoLogger.debug(message);
    }

    trace(message: any): any {
        return this.pinoLogger.trace(message);
    }
}
