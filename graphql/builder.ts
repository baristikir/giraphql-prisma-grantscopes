import SchemaBuilder from "@giraphql/core";
import SimpleObjectsPlugin from "@giraphql/plugin-simple-objects";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import ValidationPlugin from "@giraphql/plugin-validation";
import PrismaPlugin from "@giraphql/plugin-prisma";
import PrismaTypes from "../prisma/giraphql-types";
import { IncomingMessage, OutgoingMessage } from "http";
import { prisma } from "../utils/db";
import { User } from "@prisma/client";

export interface BaseContext {
  req: IncomingMessage;
  res: OutgoingMessage;
}
export interface Context extends BaseContext {
  user?: User | null;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    ID: { Input: string; Output: string | number };
  };
  AuthScopes: {
    user: boolean;
  };
}>({
  plugins: [
    SimpleObjectsPlugin,
    ScopeAuthPlugin,
    ValidationPlugin,
    PrismaPlugin,
  ],
  prisma: { client: prisma },
  authScopes: async ({ user }) => ({
    user: !!user,
  }),
});

// This initializes the query and mutation types so that we can add fields to them dynamically:
builder.queryType({
  authScopes: {
    user: true,
  },
});
builder.mutationType({
  authScopes: {
    user: true,
  },
});
