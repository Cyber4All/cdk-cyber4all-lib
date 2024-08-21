import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ECSConstruct } from "../constructs/ecs";

export interface ECSProductStackProps extends cdk.StackProps {
  readonly acceleratorPrefix: string;
}

export class ECSProductStack extends cdk.aws_servicecatalog.ProductStack {
  constructor(scope: Construct, id: string, props?: ECSProductStackProps) {
    super(scope, id);

    const clusterName = new cdk.CfnParameter(this, "ClusterName", {
      type: "String",
      description: "The name of the ECS cluster",
    });

    const logRetention = new cdk.CfnParameter(this, "LogRetention", {
      type: "Number",
      description: "Amount in days for retaining logs",
    });

    const ECSProductStackParameterLabels: { [p: string]: { default: string } } =
      {
        [clusterName.logicalId]: { default: "Cluster name" },
        [logRetention.logicalId]: { default: "Log retention" },
      };

    new ECSConstruct(this, clusterName.valueAsString, {
      logRetention: logRetention.valueAsNumber,
    });
  }
}
