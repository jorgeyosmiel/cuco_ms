import { ErrorMessageCode } from '@constants/error-message-code';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    // You can throw an exception based on either "info" or "err" arguments

    if (err || !user || info) {
      Logger.error(
        err,
        user,
        info,
        context.switchToHttp().getRequest().ip,
        status,
      );
      throw new UnauthorizedException(ErrorMessageCode.AUTH_INVALID_TOKEN);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
