import * as cdk from "aws-cdk-lib";
import { VPC } from "../lib/constructs/vpc";
import { VPCProductStack } from "../lib/products/vpc-product-stack";

const app = new cdk.App();

const stack = new VPCProductStack(app, "MyStack");
