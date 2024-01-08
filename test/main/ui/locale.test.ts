import { deepCopy } from "../../../src/main/ui/locale";

describe('deepCopy', ()=>{
  it('should merge two objects with depth 1', ()=>{
    const target = { a: '1', b: '2' };
    const source = { b: '3', c: '4' };
    const result = deepCopy(target, source);
    expect(result).toEqual({ a: '1', b: '3', c: '4' });
  });

  it('should merge two objects with nested objects', ()=>{
    const target = { a: '1', b: { c: '2' } };
    const source = { b: { d: '3' }, e: '4' };
    const result = deepCopy(target, source);
    expect(result).toEqual({ a: '1', b: { c: '2', d: '3' }, e: '4' });
  });

  it('should handle arrays correctly', ()=>{
    const target = { a: ['1', '2'], b: { c: ['3', '4'] } };
    const source = { a: ['5', '6'], b: { c: ['7', '8'] } };
    const result = deepCopy(target, source);
    expect(result).toEqual({ a: { 0: '5', 1: '6' }, b: { c: { 0: '7', 1: '8' } } });
  });

  it('should handle null and undefined values', ()=>{
    const target = { a: 1, b: null };
    const source = { b: 2, c: undefined };
    const result = deepCopy(target, source);
    expect(result).toEqual({ a: 1, b: '2', c: undefined });
  });
});
