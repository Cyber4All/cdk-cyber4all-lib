import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export type ECSProps = {
  autoscaling: Partial<cdk.aws_autoscaling.AutoScalingGroupProps>;
};

export class ECSConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: Partial<ECSProps>) {
    super(scope, id);

    // Defining a new log group for cluster use.
    const cloudWatchLogGroup = new cdk.aws_logs.LogGroup(
      this,
      `${id}CloudWatchLogGroup`,
      {
        retention: 90,
      }
    );

    const discoveryNamespace = new cdk.aws_servicediscovery.CfnHttpNamespace(
      this,
      id,
      { name: id }
    );

    const cluster = new cdk.aws_ecs.CfnCluster(this, `${id}Cluster`, {
      configuration: {
        executeCommandConfiguration: {
          logging: "OVERRIDE",
          logConfiguration: {
            cloudWatchLogGroupName: cloudWatchLogGroup.logGroupName,
          },
        },
      },
      clusterSettings: [
        {
          name: "containerInsights",
          value: "true",
        },
      ],
      serviceConnectDefaults: {
        namespace: discoveryNamespace.name,
      },
    });

    const launchTemplate = new cdk.aws_ec2.LaunchTemplate(
      this,
      `${id}LaunchTemplate`
    );

    const autoScalingGroup = new cdk.aws_autoscaling.AutoScalingGroup(
      this,
      `${id}AutoScalingGroup`,
      {
        minCapacity: props?.autoscaling?.minCapacity ?? 1,
        maxCapacity: props?.autoscaling?.maxCapacity ?? 3,
        // TODO: Replace this with John's VPC
        vpc: new cdk.aws_ec2.Vpc(this, `${id}Vpc`, {}),
        // TODO: Change?
        machineImage: cdk.aws_ec2.MachineImage.genericLinux({
          "us-east-1": "ami-011425496927b80c0",
        }),
        instanceType: new cdk.aws_ec2.InstanceType("t3.micro"),
      }
    );

    const capacityProvider = new cdk.aws_ecs.AsgCapacityProvider(
      this,
      `${id}CapacityProvider`,
      { autoScalingGroup }
    );
  }
}
