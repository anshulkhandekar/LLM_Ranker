export const LLM_REQUEST_MAX_LENGTH = 80;

const ALLOWED_LLM_REQUEST_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .:_+/()#-]*$/;
const PROMPT_INJECTION_PATTERN =
  /\b(ignore|disregard|forget|override|system prompt|developer message|instructions?|tool call|shell|script|sudo|curl|fetch|http:\/\/|https:\/\/|www\.|<script|<\/|SELECT\b|INSERT\b|UPDATE\b|DELETE\b|DROP\b)\b/i;

export type LlmRequestValidationResult =
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      message: string;
    };

export const sanitizeLlmRequestName = (value: string) => value.replace(/\s+/g, ' ').trim();

export const validateLlmRequestName = (value: string): LlmRequestValidationResult => {
  const sanitized = sanitizeLlmRequestName(value);

  if (!sanitized) {
    return { ok: false, message: 'Enter the name of an LLM first.' };
  }

  if (sanitized.length > LLM_REQUEST_MAX_LENGTH) {
    return { ok: false, message: `Keep the LLM name under ${LLM_REQUEST_MAX_LENGTH} characters.` };
  }

  if (!ALLOWED_LLM_REQUEST_PATTERN.test(sanitized)) {
    return { ok: false, message: 'Use only letters, numbers, spaces, and common model-name punctuation.' };
  }

  if (PROMPT_INJECTION_PATTERN.test(sanitized)) {
    return { ok: false, message: 'Please submit only the model name, not instructions or links.' };
  }

  return { ok: true, value: sanitized };
};
