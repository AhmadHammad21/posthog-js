---
'posthog-js': minor
'posthog-node': minor
'@posthog/core': patch
---

Logs and spans now carry `os.name` and `os.version` resource attributes, so you can filter and group by operating system in PostHog. `posthog-js` detects them from the browser's user agent; `posthog-node` reads them from the host on the Node runtime (the edge build sends neither). Either key is omitted when it can't be determined, and both are overridable through `resourceAttributes` on the `logs` and `traces` options. `posthog-react-native` has sent these attributes since logs shipped.
