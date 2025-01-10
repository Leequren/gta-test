import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export interface IUser {
  id: number;
  balance: number;
}
export const userIdSchema = z.string().transform((val) => {
  const parsed = Number(val);
  if (isNaN(parsed)) {
    throw new BadRequestException('Invalid ID');
  }
  if (parsed < 1) {
    throw new BadRequestException('ID is not positive');
  }
  return parsed;
});

export type TUserIdZod = z.infer<typeof userIdSchema>;

export const topupBalanceBodySchema = z.object({
  amount: z.number().min(1),
});

export type TtopupBalanceBodySchema = z.infer<typeof topupBalanceBodySchema>;

export const takeoffBalanceBodySchema = z.object({
  amount: z.number().min(1),
});

export type TtakeoffBalanceBodySchema = z.infer<typeof topupBalanceBodySchema>;

export const transferBodySchema = z.object({
  targetId: z.number().min(1),
  amount: z.number().min(1),
});

export type TtransferBodySchema = z.infer<typeof transferBodySchema>;
