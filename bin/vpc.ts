import * as cdk from "aws-cdk-lib";
import { VPC } from "../lib/constructs/vpc";

const app = new cdk.App();

const stack = new cdk.Stack(app, "MyStack", {
    stackName: "MyStack",
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});

new VPC(stack, "PROD_VPC", {
    enablePublicSubnets: true,
    enablePrivateSubnets: true,
    name: "MyVPC",
    availabilityZones: ["us-east-1a", "us-east-1b"],
    natGateways: 1,
});