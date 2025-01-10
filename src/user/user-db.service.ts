import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { IUser } from './user.schema';
import { ITransaction } from './user.dto';

@Injectable()
export class UserServiceDB {
  constructor(@Inject('DB') private db: Pool) {}
  async topupBalance(userId: number, amount: number) {
    const sql = `UPDATE users SET balance = balance + ${amount} WHERE id = ${userId} RETURNING id, balance;`;
    const res = await this.db.query<IUser>(sql);

    if (!res.rowCount) {
      return 'user not found';
    }

    const sqlTransaction = `INSERT INTO transactions (type, user_id, amount) VALUES ('topup', ${userId}, ${amount})`;
    await this.db.query(sqlTransaction);
    console.log(res);
    return res.rows[0];
  }

  async takeoffBalance(userId: number, amount: number) {
    const sql = `UPDATE users SET balance = balance - ${amount} WHERE id = ${userId} AND balance >= ${amount} RETURNING id, balance;`;
    const res = await this.db.query<IUser>(sql);

    if (!res.rowCount) {
      const userCheck = await this.db.query(
        `SELECT id FROM users WHERE id = ${userId}`,
      );

      if (userCheck.rows.length === 0) {
        return 'User not found';
      } else {
        return 'Insufficient funds';
      }
    }

    const sqlTransaction = `INSERT INTO transactions (type, user_id, amount) VALUES ('takeoff', ${userId}, ${amount})`;
    await this.db.query(sqlTransaction);
    console.log(res);
    return res.rows[0];
  }

  async createUser() {
    const sql = `INSERT INTO users (balance) VALUES (0) RETURNING id, balance;`;
    const res = await this.db.query<IUser>(sql);
    const newUser = res.rows[0];
    const sqlTransaction = `INSERT INTO transactions (type, user_id, amount) VALUES ('create', ${newUser.id}, 0)`;
    await this.db.query(sqlTransaction);
    return newUser;
  }

  async getUserInfoById(id: number) {
    const sqlUser = `select * from users where id = ${id}`;
    const resUser = await this.db.query<IUser>(sqlUser);
    const user = resUser.rows[0];

    if (!user) {
      return 'user not found';
    }

    const sqlTransactions = `SELECT * FROM transactions where user_id = ${id} OR target_user_id = ${id}`;
    const userTransactions = await this.db.query<ITransaction>(sqlTransactions);
    console.log(userTransactions.rows);

    const serializedUser = {
      ...user,
      transactions: userTransactions.rows.map((transaction) => ({
        timeTransaction: transaction.time_transaction,
        targetUserId: transaction.target_user_id,
        id: transaction.id,
        userId: transaction.user_id,
        type: transaction.type,
        amount: transaction.amount,
      })),
    };

    return serializedUser;
  }

  async getUserBalance(id: number) {
    const sql = `select balance from users where id = ${id}`;
    const res = await this.db.query(sql);
    if (!res.rowCount) {
      return 'user not found';
    }
    return res.rows[0];
  }

  async transferMoney(
    senderId: number,
    targetUserId: number,
    amount: number,
  ): Promise<string> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      const senderResult = await client.query(
        `SELECT balance FROM users WHERE id = ${senderId} FOR UPDATE`,
      );

      if (senderResult.rows.length === 0) {
        return 'Sender not found';
      }

      const senderBalance = senderResult.rows[0].balance;
      if (senderBalance < amount) {
        return 'Insufficient funds';
      }

      const recipientResult = await client.query(
        `SELECT id FROM users WHERE id = ${targetUserId} FOR UPDATE`,
      );

      if (recipientResult.rows.length === 0) {
        return 'Recipient not found';
      }

      await client.query(
        `UPDATE users SET balance = balance - ${amount} WHERE id = ${senderId}`,
      );

      await client.query(
        `UPDATE users SET balance = balance + ${amount} WHERE id = ${targetUserId}`,
      );

      await client.query(
        `INSERT INTO transactions (user_id, target_user_id, amount, type) VALUES (${senderId}, ${targetUserId}, ${amount}, 'transfer')`,
      );

      await client.query('COMMIT');
      return 'Transfer successful';
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
