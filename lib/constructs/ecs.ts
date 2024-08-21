import * as cdk from "aws-cdk-lib";
import { ExecuteCommandLogging } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export type ECSProps = {
  /** The ID of the VPC */
  vpcId: string;
  /** The subnets to use */
  vpcSubnetIds: string[];

  /** Autoscaling configuration */
  scaling?: {
    /** Min machines to spin up. Default: 1 */
    min: number;
    /** Max machines to spin up. Default: 3 */
    max: number;
  };

  /** The kind of machine to use */
  machine?: {
    /** Machine AMI image */
    image: string;
    /** Instance type */
    instanceType: string;
  };
};

export class ECSConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: Partial<ECSProps>) {
    super(scope, id);

    // Defining a new log group for cluster use.
    const cloudWatchLogGroup = new cdk.aws_logs.LogGroup(
      this,
      `CloudWatchLogGroup`,
      {
        retention: 90,
      }
    );

    const discoveryNamespace = new cdk.aws_servicediscovery.CfnHttpNamespace(
      this,
      `DiscoveryNamespace`,
      { name: id }
    );

    const cluster = new cdk.aws_ecs.Cluster(this, `Cluster`, {
      executeCommandConfiguration: {
        logging: ExecuteCommandLogging.OVERRIDE,
        logConfiguration: {
          cloudWatchLogGroup: cloudWatchLogGroup,
        },
      },
      containerInsights: true,
      defaultCloudMapNamespace: discoveryNamespace,
      // TODO: Use John's VPC.
      vpc: new cdk.aws_ec2.Vpc(this, `VPC`, {})
    });
  }
}
