# Distributed Logging System

A high-performance, distributed logging system built for observability at scale. Designed to capture and query structured logs enriched with tracing metadata (trace ID, span ID, parent ID), enabling efficient log retrieval in microservice environments.

## Overview

This system is inspired by modern tracing infrastructures such as those used by Uber and Discord. It enables precise log correlation across distributed services by collecting logs with contextual metadata like trace IDs and span hierarchies. The system uses gRPC for fast communication, Kafka for message streaming, and PostgreSQL for reliable storage and querying.

An example use case is when a request spans multiple microservices and emits logs at each hop. This logging service allows querying all logs for a given trace ID to reconstruct the full execution path of a request — critical for debugging, latency analysis, and monitoring.

### Key Features

- **Structured Logging**: Logs include trace ID, span ID, parent span ID, service name, log level, timestamp, and message
- **Trace Correlation**: Retrieve all logs for a trace ID to understand full request flow
- **DAG Storage**: Error traces stored as directed acyclic graphs for visual analysis of error propagation
- **High Throughput**: Built with NestJS and gRPC for minimal latency and maximum concurrency
- **Distributed Architecture**: Multiple services working together with Kafka message broker
- **Error Handling**: Standardized gRPC status codes with descriptive messages

## Architecture

![Distributed Log Tracing Architecture](./Screenshot%202025-04-17%20100108.png)

The system consists of several components working together:

1. **Log Sources**: Microservices (A, B, C) that generate logs with tracing metadata
2. **Log Ingest Service**: Receives structured logs via gRPC and forwards them to Kafka
3. **Kafka**: Message broker that stores raw logs in the `logs.raw` topic
4. **Log Processor Service**: Consumes logs from Kafka, processes them, and stores in PostgreSQL
5. **Query Service**: Provides gRPC APIs for querying logs and DAGs
6. **PostgreSQL**: Stores processed logs and DAGs for error traces in separate databases

---

## Directed Acyclic Graph (DAG) Implementation

Our system stores error traces as DAGs to provide visual representation of request flows and error propagation across services.

### How It Works

The system uses two separate PostgreSQL databases to manage logs and DAGs:

- `log-ingestion-db`: Stores individual log entries
- `dag-builder-db`: Stores the DAG representations of traces

Each DAG is stored with:

- `traceId`: Unique identifier for the trace
- `rootSpanId`: The ID of the root span in the trace
- `dagJson`: JSON representation of the DAG structure

### Querying DAGs

To retrieve a specific DAG by trace ID:

```bash
$ grpcurl -plaintext -d '{"trace_id": "abc123"}' localhost:50051 query.QueryService/GetDagByTraceId
```

You can also retrieve all DAGs:

```bash
$ grpcurl -plaintext localhost:50051 query.QueryService/GetDags
```

DAG response example:

```json
{
  "traceId": "abc123",
  "rootSpanId": "span123",
  "dagJson": {
    "nodes": [
      { "id": "span123", "service": "api-gateway", "level": "info" },
      { "id": "span456", "service": "auth-service", "level": "error" }
    ],
    "edges": [{ "source": "span123", "target": "span456" }]
  }
}
```

---

## Setup

### Prerequisites

- Node.js 18+
- NestJS 10+
- PostgreSQL 14+
- Kafka 3.0+
- Docker (optional for quick start)
- Protocol Buffers compiler (`protoc`)

### Start the System

Using Docker Compose (recommended for local testing):

```bash
$ docker-compose up --build
```

You'll see logs confirming the services are running:

```
log-ingest-1  | [NestApplication] Microservice is listening on: {"transport":"grpc"}
log-processor-1  | [NestApplication] Kafka consumer connected
query-service-1  | [NestApplication] gRPC server started on port 50051
```

---

## Logging Format

Each log entry includes the following fields:

| Field     | Type              | Description                                 |
| --------- | ----------------- | ------------------------------------------- |
| traceId   | string            | Unique ID representing a full request trace |
| spanId    | string            | Unique ID for this log's operation span     |
| parentId  | string (nullable) | Span ID of the parent (if any)              |
| service   | string            | Name of the service emitting the log        |
| message   | string            | Log message content                         |
| level     | enum              | Log level: `info`, `debug`, `warn`, `error` |
| timestamp | ISO 8601 / Date   | Time the log was emitted                    |

Example payload:

```json
{
  "traceId": "abc123",
  "spanId": "span456",
  "parentId": "span123",
  "service": "auth-service",
  "level": "error",
  "message": "User login failed: invalid credentials",
  "timestamp": "2025-04-16T14:30:00Z"
}
```

---

## Querying Logs

Use the Query Service to access logs:

### Get All Logs

```bash
$ grpcurl -plaintext localhost:50051 query.QueryService/GetLogs
```

### Get Logs by Trace ID

```bash
$ grpcurl -plaintext -d '{"trace_id": "abc123"}' localhost:50051 query.QueryService/GetLogsByTraceId
```

Response:

```json
{
  "logs": [
    {
      "traceId": "abc123",
      "spanId": "span456",
      "parentId": "span123",
      "service": "auth-service",
      "level": "error",
      "message": "User login failed: invalid credentials",
      "timestamp": "2025-04-16T14:30:00Z"
    },
    ...
  ]
}
```

---

## Error Handling

The system uses a `tryCatch` utility to handle errors consistently. All service methods return standardized gRPC error responses:

- `INTERNAL`: For database connection issues or processing errors

Example:

```bash
rpc error: code = Internal desc = Failed to fetch logs by trace id
```

---

## Project Structure

```
distributed-logging/
├── apps/
│   ├── log-ingest/          # gRPC service that receives logs
│   ├── log-processor/       # Kafka consumer that processes logs
│   └── query-service/       # gRPC service for querying logs and DAGs
├── libs/
│   ├── db/
│   │   ├── src/
│   │   │   ├── constants.ts        # Database injection tokens
│   │   │   ├── log-ingestion-db/   # Log storage schema
│   │   │   └── dag-builder-db/     # DAG storage schema
│   ├── proto/                      # Protocol buffer definitions
│   └── types/                      # Shared types and utilities
└── docker-compose.yml             # Docker setup for local development
```

---

## Technical Details

### Database Implementation

The system uses [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) with PostgreSQL for database operations:

- Two separate databases:
  - `LOG_INGESTION_DB`: For storing individual log entries
  - `DAG_BUILDER_DB`: For storing DAG representations of traces

### Query Service Implementation

The Query Service provides four main methods:

- `getLogs()`: Retrieves all logs
- `getDags()`: Retrieves all DAGs
- `getLogsByTraceId()`: Retrieves logs for a specific trace
- `getDagByTraceId()`: Retrieves the DAG for a specific trace

Each method uses Drizzle ORM for type-safe database queries and implements proper error handling.

### DAG Schema

DAGs are stored with the following schema:

- `traceId`: String (primary key)
- `rootSpanId`: String
- `dagJson`: JSONB (stores the graph structure)

---

## Future Improvements

- **Error Notification Service**: Implement alerting for critical errors as shown in the architecture diagram
- **REST API Wrapper**: Add REST endpoints for easier integration with web frontends
- \*\*DAG Visualization
