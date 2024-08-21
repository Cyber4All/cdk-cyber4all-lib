import * as cdk from "aws-cdk-lib";
import { ExecuteCommandLogging } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export type ECSProps = {
  logRetention: number;
};

export class ECSConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: Partial<ECSProps>) {
    super(scope, id);

    // Defining a new log group for cluster use.
    const cloudWatchLogGroup = new cdk.aws_logs.LogGroup(
      this,
      `CloudWatchLogGroup`,
      {
        retention: props?.logRetention,
      }
    );

    const discoveryNamespace = new cdk.aws_servicediscovery.CfnHttpNamespace(
      this,
      `DiscoveryNamespace`,
      { name: id }
    );

    new cdk.aws_ecs.Cluster(this, `Cluster`, {
      executeCommandConfiguration: {
        logging: ExecuteCommandLogging.OVERRIDE,
        logConfiguration: {
          cloudWatchLogGroup: cloudWatchLogGroup,
        },
      },
      enableFargateCapacityProviders: true,
      containerInsights: true,
      defaultCloudMapNamespace: discoveryNamespace,
      // TODO: Do we need a VPC?
      // vpc: cdk.aws_,
    });
  }
}
