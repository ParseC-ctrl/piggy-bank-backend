import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userIdFromParam = request.params.userId;
    const userIdFromBody = request.body.userId;
    const userIdFromQuery = request.query.userId;
    const userIdFromJwt = request.user.userId;
    const userId = userIdFromParam || userIdFromBody || userIdFromQuery;

    if (userId !== userIdFromJwt) {
      throw new ForbiddenException(
        "You are not authorized to access this user's piggy bank",
      );
    }
    return true;
  }
}
