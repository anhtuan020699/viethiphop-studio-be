import { SetMetadata } from '@nestjs/common';
import { Role } from '@helpers/enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Restrict route to specific roles
 * Usage: @Roles(Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
