# Guide to write APIs

This project organizes API definitions by context. All endpoint specifications are located in the `endpoints/` directory, each file grouping related APIs.

## Referencing endpoints

Inside each file there could be multiple endpoints,
you can reference a specific endpoint using this syntax:

```yaml
$ref: "./endpoints/filename.yaml#/~1endpointPath"
```

Where:

- The symbol `#` is used to separate the file path from the endpoint path.
- The symbol `~1` is used to represent the `/` character in the endpoint path.
