import '@testing-library/jest-dom/extend-expect';
import { server } from './mocks/server';
import ResizeObserver from 'resize-observer-polyfill';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.ResizeObserver = ResizeObserver;
