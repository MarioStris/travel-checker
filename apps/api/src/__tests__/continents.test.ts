import { describe, it, expect } from 'vitest';
import { getContinent } from '../lib/continents.js';

describe('getContinent', () => {
  it('maps European country codes correctly', () => {
    expect(getContinent('HR')).toBe('Europe');
    expect(getContinent('DE')).toBe('Europe');
    expect(getContinent('GB')).toBe('Europe');
    expect(getContinent('IS')).toBe('Europe');
  });

  it('maps Asian country codes correctly', () => {
    expect(getContinent('JP')).toBe('Asia');
    expect(getContinent('CN')).toBe('Asia');
    expect(getContinent('TH')).toBe('Asia');
    expect(getContinent('AE')).toBe('Asia');
  });

  it('maps African country codes correctly', () => {
    expect(getContinent('MA')).toBe('Africa');
    expect(getContinent('ZA')).toBe('Africa');
    expect(getContinent('KE')).toBe('Africa');
  });

  it('maps North American country codes correctly', () => {
    expect(getContinent('US')).toBe('North America');
    expect(getContinent('CA')).toBe('North America');
    expect(getContinent('MX')).toBe('North America');
  });

  it('maps South American country codes correctly', () => {
    expect(getContinent('BR')).toBe('South America');
    expect(getContinent('AR')).toBe('South America');
    expect(getContinent('CO')).toBe('South America');
  });

  it('maps Oceanian country codes correctly', () => {
    expect(getContinent('AU')).toBe('Oceania');
    expect(getContinent('NZ')).toBe('Oceania');
  });

  it('returns Other for unknown country codes', () => {
    expect(getContinent('XX')).toBe('Other');
    expect(getContinent('ZZ')).toBe('Other');
    expect(getContinent('')).toBe('Other');
  });
});
