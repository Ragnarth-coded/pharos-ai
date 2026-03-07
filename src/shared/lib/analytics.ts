import posthog from 'posthog-js';

/**
 * Thin wrapper around PostHog event capture.
 * No-ops gracefully when PostHog is not initialised (e.g. missing env key).
 */
export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(event, properties);
  }
}
