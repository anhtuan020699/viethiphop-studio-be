import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../constants/app.constant';

/**
 * Hash a plain text string using bcrypt
 */
export async function hashData(data: string): Promise<string> {
  return bcrypt.hash(data, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a plain text string with a bcrypt hash
 */
export async function compareData(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
