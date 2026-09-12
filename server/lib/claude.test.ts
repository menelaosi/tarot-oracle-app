import { describe, expect, it, vi } from 'vitest';
import type { HttpError as HttpErrorType } from './http-error.js';

// anthropic-client.ts computes its exports eagerly from process.env at import
// time, so each scenario below mocks it fresh via vi.doMock + vi.resetModules
// + a dynamic import, rather than relying on a shared module-level mock.
// HttpError itself is re-imported alongside claude.js in the same dynamic
// import below — vi.resetModules() gives claude.js a fresh module registry,
// so a statically-imported HttpError here would fail `instanceof` against it.

describe('createSystemRules', () => {
  it('appends the shared voice and disclaimer lines after the given rules', async () => {
    vi.resetModules();
    vi.doMock('./anthropic-client.js', () => ({ anthropic: null, claudeModel: 'test-model' }));
    const { createSystemRules } = await import('./claude.js');

    expect(createSystemRules(['Rule one.', 'Rule two.'])).toBe(
      'Rule one. Rule two. Address them as "you" and "your"; never the third person. ' +
        'Warm, plain, and encouraging like a conversation not a clinical report. ' +
        'No medical, legal, financial, or guaranteed predictive claims.',
    );
  });

  it('still appends the shared lines when given no rules at all', async () => {
    vi.resetModules();
    vi.doMock('./anthropic-client.js', () => ({ anthropic: null, claudeModel: 'test-model' }));
    const { createSystemRules } = await import('./claude.js');

    expect(createSystemRules([])).toBe(
      'Address them as "you" and "your"; never the third person. ' +
        'Warm, plain, and encouraging like a conversation not a clinical report. ' +
        'No medical, legal, financial, or guaranteed predictive claims.',
    );
  });
});

describe('requireAnthropic', () => {
  it('throws a 503 HttpError when no client is configured', async () => {
    vi.resetModules();
    vi.doMock('./anthropic-client.js', () => ({ anthropic: null, claudeModel: 'test-model' }));
    const { requireAnthropic } = await import('./claude.js');
    const { HttpError } = await import('./http-error.js');

    try {
      requireAnthropic();
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpErrorType).status).toBe(503);
    }
  });

  it('returns the configured client unchanged', async () => {
    vi.resetModules();
    const fakeClient = {};
    vi.doMock('./anthropic-client.js', () => ({
      anthropic: fakeClient,
      claudeModel: 'test-model',
    }));
    const { requireAnthropic } = await import('./claude.js');

    expect(requireAnthropic()).toBe(fakeClient);
  });
});

describe('generateReading', () => {
  async function withFakeClient(create: ReturnType<typeof vi.fn>) {
    vi.resetModules();
    vi.doMock('./anthropic-client.js', () => ({
      anthropic: { messages: { create } },
      claudeModel: 'test-model',
    }));
    return import('./claude.js');
  }

  it('sends model, max_tokens, system, and a single user message', async () => {
    const create = vi.fn().mockResolvedValue({
      stop_reason: 'end_turn',
      usage: { input_tokens: 10, output_tokens: 20 },
      content: [{ type: 'text', text: 'A reading.' }],
    });
    const { generateReading } = await withFakeClient(create);

    await generateReading('system prompt', 'user prompt', 500, 'test');

    expect(create).toHaveBeenCalledWith({
      model: 'test-model',
      max_tokens: 500,
      system: 'system prompt',
      messages: [{ role: 'user', content: 'user prompt' }],
    });
  });

  it('JSON-stringifies an object prompt as the message content', async () => {
    const create = vi.fn().mockResolvedValue({
      stop_reason: 'end_turn',
      usage: { input_tokens: 1, output_tokens: 1 },
      content: [{ type: 'text', text: 'ok' }],
    });
    const { generateReading } = await withFakeClient(create);

    await generateReading('system', { chart: 'data' }, 500, 'test');

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: 'user', content: JSON.stringify({ chart: 'data' }) }],
      }),
    );
  });

  it('joins multiple text blocks with newlines and drops non-text blocks', async () => {
    const create = vi.fn().mockResolvedValue({
      stop_reason: 'end_turn',
      usage: { input_tokens: 1, output_tokens: 1 },
      content: [
        { type: 'text', text: 'First.' },
        { type: 'other_block_type' },
        { type: 'text', text: 'Second.' },
      ],
    });
    const { generateReading } = await withFakeClient(create);

    await expect(generateReading('system', 'prompt', 500, 'test')).resolves.toBe('First.\nSecond.');
  });

  it('warns when the response was cut off at the token limit', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const create = vi.fn().mockResolvedValue({
      stop_reason: 'max_tokens',
      usage: { input_tokens: 1, output_tokens: 1 },
      content: [{ type: 'text', text: 'cut off' }],
    });
    const { generateReading } = await withFakeClient(create);

    await generateReading('system', 'prompt', 500, 'test');

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not warn when the response finished normally', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const create = vi.fn().mockResolvedValue({
      stop_reason: 'end_turn',
      usage: { input_tokens: 1, output_tokens: 1 },
      content: [{ type: 'text', text: 'fine' }],
    });
    const { generateReading } = await withFakeClient(create);

    await generateReading('system', 'prompt', 500, 'test');

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
