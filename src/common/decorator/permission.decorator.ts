import { Reflector } from '@nestjs/core';
import { PermissionsEnum } from '../../permission/permission.enums';

export const RequirePermission = Reflector.createDecorator<PermissionsEnum>();
