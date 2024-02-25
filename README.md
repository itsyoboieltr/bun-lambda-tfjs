# bun-lambda-tfjs

This is a simple example of a serverless application that uses Bun and TensorFlow.js to perform random predictions. It uses the [AWS CDK](https://aws.amazon.com/cdk/) to deploy the application.

To install dependencies:

```bash
bun install
```

To develop:

```bash
bun dev
```

To run:

```bash
bun start
```

To deploy:

```bash
bun run deploy
```

Deployment requires [CDK bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) in your AWS account. This is a one-time action that you must perform for every environment that you deploy resources into. To do this, run:

```bash
bunx cdk bootstrap
```
