import { rest } from 'msw';

export const handlers = [
  rest.get(`${process.env.REACT_APP_API_URL}`, async (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json('Server ON!'));
  }),
];
