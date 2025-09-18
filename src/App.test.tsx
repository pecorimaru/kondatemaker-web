import { it, expect } from 'vitest';

// 基本的なテスト：数学ライブラリのテスト
it('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

// 基本的なテスト：文字列のテスト
it('string concatenation works', () => {
  expect('hello' + ' ' + 'world').toBe('hello world');
});
