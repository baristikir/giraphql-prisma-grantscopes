import type { Prisma, Article, User } from "/Users/baristikir/tmp/giraphql-prismaobject-grantscopes/node_modules/@prisma/client";
export default interface PrismaTypes {
    Article: {
        Shape: Article;
        Include: Prisma.ArticleInclude;
        Where: Prisma.ArticleWhereUniqueInput;
        Fields: "Author";
        ListRelations: never;
        Relations: {
            Author: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
    User: {
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "Artice";
        ListRelations: "Artice";
        Relations: {
            Artice: {
                Shape: Article[];
                Types: PrismaTypes["Article"];
            };
        };
    };
}