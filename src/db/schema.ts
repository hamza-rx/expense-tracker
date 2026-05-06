import { pgTable, uuid, text, timestamp, numeric, boolean, primaryKey, integer } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable('users', {
  id:            uuid('id').primaryKey().defaultRandom(),
  email:         text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  name:          text('name'),
  image:         text('image'),
  createdAt:     timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id:     uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name:   text('name').notNull(),
  color:  text('color'),
  icon:   text('icon'),
});

export const expenses = pgTable('expenses', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  categoryId:  uuid('category_id').references(() => categories.id),
  amount:      numeric('amount', { precision: 10, scale: 2 }).notNull(),
  note:        text('note'),
  date:        timestamp('date').notNull(),
  isRecurring: boolean('is_recurring').default(false),
  frequency:   text('frequency'),
  createdAt:   timestamp('created_at').defaultNow(),
});

export const budgets = pgTable('budgets', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').references(() => users.id),
  categoryId:  uuid('category_id').references(() => categories.id),
  limitAmount: numeric('limit_amount', { precision: 10, scale: 2 }).notNull(),
  period:      text('period').default('monthly'),
});

export const accounts = pgTable(
  'accounts',
  {
    userId:            uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type:              text('type').$type<AdapterAccountType>().notNull(),
    provider:          text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token:     text('refresh_token'),
    access_token:      text('access_token'),
    expires_at:        integer('expires_at'),
    token_type:        text('token_type'),
    scope:             text('scope'),
    id_token:          text('id_token'),
    session_state:     text('session_state'),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId:       uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token:      text('token').notNull(),
    expires:    timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [
    primaryKey({ columns: [vt.identifier, vt.token] }),
  ]
);