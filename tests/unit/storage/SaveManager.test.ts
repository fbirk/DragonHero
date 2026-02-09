import { describe, it, expect } from 'vitest';
import { exportSave, importSave, createDefaultSave, type SaveData } from '../../../src/storage/SaveManager';

describe('SaveManager', () => {
  describe('createDefaultSave', () => {
    it('creates save with version 1 and null highest level', () => {
      const save = createDefaultSave();
      expect(save.version).toBe(1);
      expect(save.highestLevelCompleted).toBeNull();
      expect(save.totalPlayTime).toBe(0);
      expect(save.lastSaved).toBeTruthy();
    });
  });

  describe('exportSave', () => {
    it('serializes save data to JSON string', () => {
      const save: SaveData = {
        version: 1,
        highestLevelCompleted: 'level-1',
        totalPlayTime: 312,
        lastSaved: '2026-02-09T14:30:00.000Z',
      };
      const json = exportSave(save);
      const parsed = JSON.parse(json);
      expect(parsed.version).toBe(1);
      expect(parsed.highestLevelCompleted).toBe('level-1');
      expect(parsed.totalPlayTime).toBe(312);
    });
  });

  describe('importSave', () => {
    it('parses valid JSON save data', () => {
      const json = JSON.stringify({
        version: 1,
        highestLevelCompleted: 'level-1',
        totalPlayTime: 100,
        lastSaved: '2026-01-01T00:00:00.000Z',
      });
      const result = importSave(json);
      expect(result).not.toBeNull();
      expect(result!.highestLevelCompleted).toBe('level-1');
    });

    it('returns null for invalid JSON', () => {
      expect(importSave('not json')).toBeNull();
    });

    it('returns null for missing version', () => {
      const json = JSON.stringify({ highestLevelCompleted: null });
      expect(importSave(json)).toBeNull();
    });

    it('returns null for future version', () => {
      const json = JSON.stringify({
        version: 99,
        highestLevelCompleted: null,
        totalPlayTime: 0,
        lastSaved: '2026-01-01T00:00:00.000Z',
      });
      expect(importSave(json)).toBeNull();
    });
  });
});
