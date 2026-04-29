import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserLevel } from 'src/common/enums/user/user.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserLevel[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    //dùng khi bạn muốn lấy metadata có cơ chế ưu tiên (override). Lấy mediaType, ưu tiên ở method (API), nếu không có thì lấy ở controller
    if (!requiredRoles) {
      // If no roles are required, allow access
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // Đảm bảo user tồn tại và có trường level
    if (!user || user.level === undefined) {
      return false;
    }

    // User must be logged in and have one of the required roles
    return requiredRoles.some((role) => user?.level === role);
  }
}
