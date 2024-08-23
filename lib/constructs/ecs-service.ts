import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export type ECSServiceProps = {
  /** The name of the service to deploy. */
  serviceName: string;

  /** The ARN of the cluster to deploy to. */
  clusterArn: string;
};

export class ECSServiceConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ECSServiceProps) {
    super(scope, id);

    const taskDefinition = new cdk.aws_ecs.FargateTaskDefinition(this, id, {});

    new cdk.aws_ecs.FargateService(this, id, {
      serviceName: props.serviceName,
      cluster: cdk.aws_ecs.Cluster.fromClusterArn(this, id, props.clusterArn),
      taskDefinition,
    });
  }
}
