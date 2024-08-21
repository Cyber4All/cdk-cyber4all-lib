import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ECSClusterConstruct } from "../constructs/ecs-cluster";

export class EcsClusterProductStack extends cdk.aws_servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clusterName = new cdk.CfnParameter(this, "Cluster Name", {
      type: "String",
      description: "The name of the ECS cluster",
    });

    const logRetention = new cdk.CfnParameter(this, "Log Retention", {
      type: "Number",
      description: "Amount in days for retaining logs",
    });

    new ECSClusterConstruct(this, clusterName.valueAsString, {
      logRetention: logRetention.valueAsNumber,
    });
  }
}
