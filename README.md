## Description

This repo serves as reproduction of an issue with Datadog tracing when combining NestJS and Prisma. This example app
is a basic NestJS application with two endpoints, `/working` and `/broken`. They each do the same thing but use prisma
clients created in different ways. The working example creates a prisma client and exports it is a js module, avoiding
the NestJS module system. The broken example creates a prisma client as a nestjs module and uses its module system
to create and inject it.

When the Prisma client is created as a NestJS module somehow the tracer context is lost between the Prisma middleware 
and the query event. The instrumentation is based on this [issue comment](https://github.com/DataDog/dd-trace-js/issues/1244#issuecomment-860071553).

## Setup

```bash
$ docker compose up -d
$ yarn
$ yarn prisma db push 
```

## Reproduction

```bash
$ yarn start:dev

# when using a prisma service creating directly you can see in the app logs that the span created in the middleware is found in the query event
$ curl localhost:3000/working

# when using a prisma service created as a nestjs module everything functionally works the same but somehow the span context is lost
$ curl localhost:3000/working

```