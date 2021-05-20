export default class BaseLogger {
  private dev: boolean

  constructor(dev: boolean) {
    this.dev = dev
  }

  // eslint-disable-next-line class-methods-use-this
  logFunction(level: string = 'INFO', msg: any) {
    switch (level) {
      case 'ERROR':
        process.stderr.write(msg)
        break
      default:
        process.stdout.write(JSON.stringify({ level, msg }))
        break
    }
  }

  log(msg: any) {
    this.logFunction('LOG', msg)
  }

  info(msg: any) {
    this.logFunction('INFO', msg)
  }

  warn(msg: any) {
    this.logFunction('WARN', msg)
  }

  // eslint-disable-next-line class-methods-use-this
  error(err: any) {
    process.stderr.write(err)
  }

  debug(msg: any) {
    this.logFunction('DEBUG', msg)
  }
}
