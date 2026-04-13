import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash } from 'bcryptjs';

const configService = new ConfigService();

type responseType = {
  errors?: object;
  data?: object;
  status: number;
  message: string;
  now: Date;
};

export const responseSuccess = (
  data: any,
  status: number = 200,
  message: string = '',
): responseType => {
  return {
    now: new Date(),
    status,
    data,
    message,
  };
};

export const responseErrors = (
  errors: [{ code: string; key?: string; value?: any }],
  status: number = 500,
  message: string = '',
): responseType => {
  return {
    errors,
    status,
    message: message || '',
    now: new Date(),
  };
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function createBcryptHashPassword(
  plainPassword: string,
): Promise<string> {
  const salt = await genSalt(+configService.get('BCRYPT_SALT_ROUND'));

  return hash(plainPassword, salt);
}

export function generateRandomOTP(length: number = 6): string {
  let otp = '';
  const digits = '0123456789';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

export function censorString(value: string): string {
  if (value.length < 4) {
    return '*'.repeat(value.length);
  }

  return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
}

export function logError(logger: Logger, error: Error, extraData: object = {}) {
  logger.error({
    ...extraData,
    message: error.message || '',
    error: error.stack || '',
  });
}

export function roundToTwo(num: number | string): number {
  const parsed = typeof num === 'string' ? parseFloat(num) : num;
  return Math.round(parsed * 100) / 100;
}
