// @vitest-environment jsdom
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import ApiError from './ApiError';
import { ApiRequest } from './ApiRequest';

vi.mock('@beautinique/frontend-hooks', () => ({
  onlineStatusStore: { recheck: vi.fn(), confirmOnline: vi.fn() },
}));

type TAdapter = (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>;

class TestApi extends ApiRequest {
  answerWith = (adapter: TAdapter) => {
    this.instance.defaults.adapter = adapter;
  };

  send = () => this.request({ url: '/anything' });
}

const answer =
  (status: number, data: unknown): TAdapter =>
  (config) => {
    const response: AxiosResponse = {
      config,
      status,
      statusText: String(status),
      headers: {},
      data,
    };

    // axios turns a status outside 2xx into an error that carries the response
    return Promise.reject(
      new AxiosError(`status ${String(status)}`, 'ERR_BAD_RESPONSE', config, null, response),
    );
  };

const failed = async (api: TestApi) => {
  try {
    await api.send();
  } catch (error) {
    return error;
  }

  throw new Error('The request did not fail');
};

// A page tells "this is not there" (404) from "this failed" with the status of the answer: ApiError carries it.
describe('ApiRequest: the status of a failed answer', () => {
  it('puts the status of the answer on the error, with the message the service gave', async () => {
    const api = new TestApi();

    api.answerWith(answer(404, { message: 'Product not found' }));

    const error = await failed(api);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).statusCode).toBe(404);
    expect((error as ApiError).message).toBe('Product not found');
  });

  it('says 500 for a failure of the service, 422 for a refused request', async () => {
    const api = new TestApi();

    api.answerWith(answer(500, { message: 'Boom' }));
    expect(((await failed(api)) as ApiError).statusCode).toBe(500);

    api.answerWith(answer(422, { message: 'No', fieldErrors: { title: ['Too short'] } }));

    const refused = (await failed(api)) as ApiError;

    expect(refused.statusCode).toBe(422);
    expect(refused.fieldErrors).toEqual({ title: ['Too short'] });
  });

  it('has no status when there was no answer at all (no connection)', async () => {
    const api = new TestApi();

    api.answerWith((config) =>
      Promise.reject(new AxiosError('Network Error', 'ERR_NETWORK', config)),
    );

    const error = (await failed(api)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBeUndefined();
  });
});
