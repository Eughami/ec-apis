import { getValue } from 'express-ctx';
import { Params } from 'nestjs-pino';
import { PrettyOptions } from 'pino-pretty';
import { nanoid } from 'nanoid';
import { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';

const pinoPrettyPrintConfig: PrettyOptions = {
  colorize: true,
  levelFirst: false,
  translateTime: 'hh:MM:ss dd/m/yyyy',
};
export const LoggerConfig: Params = {
  pinoHttp: {
    stream: {
      write(msg: string) {
        if (process.env.LOGS_PATH) {
          fs.appendFile(process.env.LOGS_PATH, msg, function (err) {
            if (err) throw err;
            console.log(msg);
          });
        } else {
          console.log(msg);
        }
      },
    },
    //level: process.env.PINO_APP_LOGGER_LEVEL || 'info',
    autoLogging: {
      ignore: (req) => {
        return req.url === req['baseUrl'];
      },
    },
    prettyPrint:
      process.env.NODE_ENV !== 'production' ? pinoPrettyPrintConfig : false,
    customLogLevel: function (
      req: IncomingMessage,
      res: ServerResponse,
      err: Error,
    ) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
    genReqId: () => {
      const reqContext = getValue('req');
      return reqContext ? reqContext.requestId || nanoid(10) : nanoid(10);
    },
  },
};
