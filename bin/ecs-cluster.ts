import * as cdk from 'aws-cdk-lib';
import { ECSClusterProductStack } from '../lib/products/ecs-cluster-product-stack';

const app = new cdk.App();
const stack = new ECSClusterProductStack(app, "MyStack");