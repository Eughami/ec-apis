import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
const excludedPath = '/files';

@Injectable()
export class HeaderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.url.includes(excludedPath)) return true;

    const headers = request.headers;
    const v = headers?.[process.env.SC_KEY]?.replace('Bearer ', '');
    return v === process.env.SC;
  }
}
