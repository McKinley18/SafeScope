export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: { timeoutMs?: number; retries?: number } = {}
) {
  const timeoutMs = options.timeoutMs ?? 25000;
  const retries = options.retries ?? 1;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      window.clearTimeout(timeout);
      return response;
    } catch (error) {
      window.clearTimeout(timeout);
      lastError = error;

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }
  }

  throw lastError;
}
