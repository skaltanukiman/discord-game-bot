import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
    useOpenAI: boolean;
    generateCount: number;
};

export const requestContext =
    new AsyncLocalStorage<RequestContext>();