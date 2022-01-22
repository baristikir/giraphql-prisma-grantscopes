import { schema } from "../../graphql/index";
import { Context } from "../../graphql/builder";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { NextApiHandler } from "next";
import { IncomingHttpHeaders } from "http";

interface GraphQLRequest {
  body?: any;
  headers: IncomingHttpHeaders;
  method: string;
  query: any;
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const request: GraphQLRequest = {
      headers: req.headers,
      method: req.method ?? "GET",
      query: req.query,
      body: req.body,
    };

    if (shouldRenderGraphiQL(request)) {
      res.setHeader("Content-Type", "text/html");
      res.send(
        renderGraphiQL({
          endpoint: "/api/graphql",
        })
      );
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest<Context>({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => ({
          req,
          res,
          user: { pk: 1, name: "Test User" },
        }),
      });

      sendResult(result, res);
    }
  } catch (err) {
    res.status(500);
    res.end(String(err));
  }
};

export default handler;
