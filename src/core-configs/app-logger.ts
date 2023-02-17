import { ConsoleLogger } from '@nestjs/common';

interface LogLevelConsent {
  levelConsent: {
    log: boolean;
    error: boolean;
    warn: boolean;
    debug: boolean;
    verbose: boolean;
  };
  contextConsent: { deny: string[] };
}

export class AppLogger extends ConsoleLogger {
  logLevelConsent: LogLevelConsent = {
    levelConsent: {
      log: true,
      error: true,
      warn: true,
      debug: true,
      verbose: true,
    },
    contextConsent: {
      deny: [],
    },
  };

  constructor() {
    super();
    const envConsentConfig = process.env.APP_LOGGER_CONSENT_CONFIG;
    const consentConfig = envConsentConfig
      ? JSON.parse(envConsentConfig)
      : this.logLevelConsent;

    super.log({
      message: 'Initiating App Logger Consent config with config: ',
      consentConfig,
    });
    this.logLevelConsent = consentConfig;
  }

  error(message: any, trace?: string, context?: string) {
    if (this.canLog('error', context)) {
      super.error(message, trace, context);
    }
  }

  log(message: any, context?: string) {
    if (this.canLog('log', context)) {
      super.log(message, context);
    }
  }

  warn(message: any, context?: string) {
    if (this.canLog('warn', context)) {
      super.warn(message, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.canLog('debug', context)) {
      super.debug(message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.canLog('verbose', context)) {
      super.verbose(message, context);
    }
  }

  private canLog(
    level: keyof LogLevelConsent['levelConsent'],
    context?: string,
  ) {
    return (
      this.logLevelConsent.levelConsent[level] &&
      !this.logLevelConsent.contextConsent.deny.includes(context)
    );
  }
}
