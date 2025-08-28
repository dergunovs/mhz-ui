import { describe, expect, test } from 'vitest';

import { html } from './string';

describe('html', () => {
  test('returns plain string when no expressions provided', () => {
    const result = html`Hello World`;

    expect(result).toBe('Hello World');
  });

  test('returns interpolated string with one expression', () => {
    const name = 'John';
    const result = html`Hello ${name}`;

    expect(result).toBe('Hello John');
  });

  test('returns interpolated string with multiple expressions', () => {
    const name = 'John';
    const age = 30;
    const result = html`Hello ${name}, you are ${age} years old`;

    expect(result).toBe('Hello John, you are 30 years old');
  });

  test('handles empty string expressions', () => {
    const result = html`Hello ${''} World`;

    expect(result).toBe('Hello  World');
  });

  test('handles null and undefined expressions', () => {
    const result1 = html`Value is ${null}`;
    const result2 = html`Value is ${undefined}`;

    expect(result1).toBe('Value is null');
    expect(result2).toBe('Value is undefined');
  });

  test('handles numeric expressions', () => {
    const result = html`Number is ${42}`;

    expect(result).toBe('Number is 42');
  });

  test('handles boolean expressions', () => {
    const result1 = html`Is true: ${true}`;
    const result2 = html`Is false: ${false}`;

    expect(result1).toBe('Is true: true');
    expect(result2).toBe('Is false: false');
  });

  test('handles object expressions', () => {
    const obj = { name: 'John' };
    const result = html`Object: ${obj}`;

    expect(result).toBe('Object: [object Object]');
  });

  test('handles array expressions', () => {
    const arr = [1, 2, 3];
    const result = html`Array: ${arr}`;

    expect(result).toBe('Array: 1,2,3');
  });

  test('handles complex template with multiple expressions', () => {
    const user = 'Alice';
    const score = 95;
    const passed = true;
    const result = html`User ${user} scored ${score} points and ${passed ? 'passed' : 'failed'} the test`;

    expect(result).toBe('User Alice scored 95 points and passed the test');
  });

  test('handles template with only expressions', () => {
    const result = html`${'Hello'} ${'World'}`;

    expect(result).toBe('Hello World');
  });

  test('handles empty template', () => {
    const result = html``;

    expect(result).toBe('');
  });
});
