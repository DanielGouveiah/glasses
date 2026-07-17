# Review rubric

For every proposed structure, ask:

1. Which current requirement, invariant, measured constraint, or repository
   decision requires it?
2. Can an existing module, dependency, platform feature, or direct function
   satisfy that evidence?
3. What concrete failure appears if it is omitted now?
4. Is the cost paid now while the benefit is merely hypothetical?

Common challenges include single-implementation interfaces, speculative
factories and registries, premature microservices, generic repositories hiding
useful queries, new dependencies duplicating native features, configuration
without a supported variation, background jobs for bounded synchronous work,
and extension points without a known extension.

Retain complexity that enforces real boundaries or failure behavior: transaction
integrity, authorization and tenant isolation, input/schema validation,
accessible interaction, durable recovery, idempotency where retries occur,
resource limits, explicit error handling, and tests that prove these properties.

An upgrade trigger must be observable. Examples: a second provider is approved;
p95 latency exceeds a named budget under a reproducible load; data exceeds a
measured volume; two deployable units need independent scaling; or a supported
client requires a second contract version.
