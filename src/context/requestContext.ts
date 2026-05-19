import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
    useOpenAI: boolean;
};

export const requestContext =
    new AsyncLocalStorage<RequestContext>();