import BaseLogger from "./BaseLogger";

export default class Logger {
    private readonly logger: BaseLogger;

    constructor({dev, log }: { dev?: boolean, log?: typeof BaseLogger }) {
        // eslint-disable-next-line new-cap
        this.logger = log ? new log(dev || false) : new BaseLogger(dev || false);
    }

    log(msg: string) {
        this.logger.log(msg)
    }


    info(msg: any) {
        this.logger.info(msg)
    }

    warn(msg: any) {
        this.logger.warn(msg)
    }

    // eslint-disable-next-line class-methods-use-this
    error(err: any) {
        this.logger.error(err)
    }

    debug(msg: any) {
        this.logger.debug(msg)
    }
}