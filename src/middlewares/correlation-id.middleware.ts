import { NextFunction, Request, Response } from 'express';
import { getValue, setValue } from 'express-ctx';
import { getClientIp } from 'request-ip';
import { generate } from 'shortid';

export function CorrelationIdMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const correlationHeader = req.header('x-correlation-id') || generate();

    const requestPayload = getValue('req') || {};

    requestPayload.ip = getClientIp(req);
    requestPayload.requestId = correlationHeader;

    setValue('req', requestPayload);

    // make sure this is lower-cased, otherwise downstream stuff will barf.
    req.headers['x-correlation-id'] = correlationHeader;
    res.set('X-Correlation-Id', correlationHeader);
    next();
  };
}
