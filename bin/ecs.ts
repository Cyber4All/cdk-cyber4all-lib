import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ECSConstruct } from "../lib/constructs/ecs";

const app = new cdk.App();

const stack = new cdk.Stack(app, "AndreasStack", {
  stackName: "AndreasStack",
  env: {},
});

new ECSConstruct(stack, "Staging_Cluster", {
  machine: { image: "ami-011425496927b80c0", instanceType: "t3.micro" },
});
