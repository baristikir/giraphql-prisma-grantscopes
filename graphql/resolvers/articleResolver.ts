import { ObjectRef } from "@giraphql/core";
import { Article } from "@prisma/client";
import { builder } from "../builder";

//
builder.prismaObject("Article", {
  findUnique: (article) => ({ pk: article.pk }),
  grantScopes: (article, { user }) => {
    // article is not the parent at that point like on the `objectType` or `objectRef`
    if (article.authorPk === user?.pk) {
      return ["canReadPrivateText"];
    }
    return [];
  },
  fields: (t) => ({
    publicText: t.exposeString("publicText"),
    privateText: t.exposeString("privateText", {
      authScopes: {
        $granted: "canReadPrivateText",
      },
    }),
  }),
});

// The parent types are working here on the `grantScopes`
// builder.objectRef<Article>("Article").implement({
//   grantScopes: (article, { user }) => {
//     if (article.authorPk === user?.pk) {
//       return ["canReadPrivateText"];
//     }
//     return [];
//   },
//   fields: (t) => ({
//     publicText: t.exposeString("publicText"),
//     privateText: t.exposeString("privateText", {
//       authScopes: {
//         $granted: "canReadPrivateText",
//       },
//     }),
//   }),
// });

builder.queryField("articles", (t) =>
  t.prismaField({
    type: ["Article"],
    resolve: async (query, _root, _args, _ctx) => {
      return await prisma!.article.findMany({
        ...query,
      });
    },
  })
);
builder.mutationField("addArticle", (t) =>
  t.prismaField({
    type: "Article",
    args: {
      publicText: t.arg.string({ required: true }),
      privateText: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, { publicText, privateText }, _ctx) => {
      if (await prisma!.user.findFirst()) {
        await prisma!.user.create({ data: { name: "Test User" } });
      }

      return await prisma!.article.create({
        data: {
          publicText,
          privateText,
          authorPk: 1,
        },
      });
    },
  })
);
