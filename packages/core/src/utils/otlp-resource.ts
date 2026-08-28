/**
 * Shape the logs, metrics and traces resolved configs share for resource
 * attribution. Generic over the attribute value type so each signal keeps its
 * own value union.
 */
export interface OtlpResourceConfig<TAttributeValue> {
  serviceName?: string
  serviceVersion?: string
  environment?: string
  resourceAttributes?: Record<string, TAttributeValue>
}

/**
 * OTLP resource attributes shared by the logs, metrics and traces envelopes.
 *
 * Layout: user `resourceAttributes` spread first, then SDK-controlled keys
 * (`service.name`, `deployment.environment`, `service.version`,
 * `telemetry.sdk.*`) layered on top so a stray user key can't clobber the
 * ingestion-attribution keys. The dedicated `serviceName` / `environment` /
 * `serviceVersion` config fields are the supported way to override the first
 * three; each SDK resolves its own `service.name` default before this point, so
 * the `unknown_service` fallback here only fires if a config slips through with
 * an empty `serviceName`.
 *
 * @internal Shared within this SDK; not part of the stable public API.
 */
export function buildOtlpResourceAttributes<TAttributeValue>(
  config: OtlpResourceConfig<TAttributeValue>,
  sdkName: string,
  sdkVersion: string
): Record<string, TAttributeValue | string> {
  return {
    ...config.resourceAttributes,
    'service.name': config.serviceName || 'unknown_service',
    ...(config.environment && { 'deployment.environment': config.environment }),
    ...(config.serviceVersion && { 'service.version': config.serviceVersion }),
    'telemetry.sdk.name': sdkName,
    'telemetry.sdk.version': sdkVersion,
  }
}
