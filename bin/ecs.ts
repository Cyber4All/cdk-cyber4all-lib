import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ECSConstruct } from "../lib/constructs/ecs";

const app = new cdk.App();

const stack = new cdk.Stack(app, "AndreasClarkService", {
  stackName: "ECSStack",
  env: {

  }
});

new ECSConstruct(stack, "AndreasClarkServiceECS")