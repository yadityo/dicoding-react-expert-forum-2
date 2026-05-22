import { describe, expect, it } from 'vitest';
import { resolveCategoryValue } from './NewThreadPage';

describe('resolveCategoryValue', () => {
  it('returns selected category when existing category is selected', () => {
    expect(resolveCategoryValue('General', '')).toBe('General');
  });

  it('returns custom category when custom option is selected', () => {
    expect(resolveCategoryValue('__custom__', '  Redux  ')).toBe('Redux');
  });

  it('returns undefined when custom category is empty', () => {
    expect(resolveCategoryValue('__custom__', '   ')).toBeUndefined();
  });

  it('returns undefined when selected category is empty', () => {
    expect(resolveCategoryValue('', '')).toBeUndefined();
  });
});
