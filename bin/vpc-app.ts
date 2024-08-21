import * as cdk from 'aws-cdk-lib';
import { VpcProductStack } from '../lib/products/vpc-product-stack';
// import { Vpc } from '../lib/constructs/vpc';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VpcStack');

new VpcProductStack(stack, 'VpcProductStack');

// new Vpc(stack, 'Vpc', {
//     enablePublicSubnets: true,
//     enablePrivateSubnets: true,
//     name: 'MyVpc',
//     availabilityZones: ['us-east-1a', 'us-east-1b'],
//     natGateways: 1,
// });