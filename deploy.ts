import { build, $ } from 'bun';
import { fetchDirectory } from 'fetchgit';
import { exists } from 'fs/promises';
import {
  App,
  Stack,
  CfnOutput,
  type StackProps,
  type Construct,
} from '@aws-cdk/core';
import {
  Function,
  Runtime,
  Code,
  Architecture,
  LayerVersion,
  FunctionUrlAuthType,
} from '@aws-cdk/aws-lambda';

// Bundle the source code

await build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  external: [
    '@tensorflow/tfjs-core',
    '@tensorflow/tfjs-layers',
    '@tensorflow/tfjs-backend-cpu',
  ],
  target: 'bun',
});

await $`cp package.json dist`;
await $`cp bun.lockb dist`;
await $`cd dist && bun install --production`;

// Fetch and build the bun lambda layer if it doesn't exist

const layerPath = 'bun-lambda/bun-lambda-layer.zip';
const layerExists = await exists(layerPath);

if (!layerExists) {
  await fetchDirectory({
    repo: 'oven-sh/bun',
    path: 'packages/bun-lambda',
    destination: '.',
    basedir_only: true,
  });
  await $`cd bun-lambda && bun install && bun run build-layer`;
}

// Deploy the stack

export class BunLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bunLayer = new LayerVersion(this, 'BunLayer', {
      code: Code.fromAsset(layerPath),
    });

    const bunLambdaFunction = new Function(this, 'BunLambdaFunction', {
      architecture: Architecture.ARM_64,
      runtime: Runtime.PROVIDED_AL2,
      code: Code.fromAsset('dist'),
      handler: 'index.fetch',
      layers: [bunLayer],
    });

    const bunLambdaFunctionUrl = bunLambdaFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, 'BunLambdaFunctionUrl', {
      value: bunLambdaFunctionUrl.url,
    });
  }
}

const app = new App();

const bunLambdaStack = new BunLambdaStack(app, 'BunLambdaStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
