import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ECSServiceConstruct } from "../constructs/ecs-service";

export class EcsServiceProductStack extends cdk.aws_servicecatalog.ProductStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const serviceName = new cdk.CfnParameter(this, "Service Name", {
      type: "String",
      description: "The name of the service to deploy.",
    });

    const clusterArn = new cdk.CfnParameter(this, "Cluster ARN", {
      // TODO: Is this a valid type??
      type: "List<AWS::ECS::Cluster>",
      description: "The name of the ECS cluster to deploy to",
    });

    new ECSServiceConstruct(this, serviceName.valueAsString, {
      clusterArn: clusterArn.valueAsString,
    });
  }
}
