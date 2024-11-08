declare module 'graphql-playground-middleware-express' {
  import { RequestHandler } from 'express';

  interface MiddlewareOptions {
    endpoint?: string;
    subscriptionEndpoint?: string;
    workspaceName?: string;
    env?: Record<string, any>;
  }

  function graphqlPlayground(options?: MiddlewareOptions): RequestHandler;

  export { graphqlPlayground, MiddlewareOptions };
  export default graphqlPlayground;
}
  