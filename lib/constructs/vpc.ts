import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { SubnetConfiguration } from "aws-cdk-lib/aws-ec2";
// import * as aws_ram from "aws-cdk-lib/aws-ram";

export interface VpcProps {
    enablePublicSubnets: boolean;
    enablePrivateSubnets: boolean;
    name: string;
    availabilityZones: string[];
    natGateways: 1;
}

export class Vpc extends Construct {
    constructor(scope: Construct, id: string, props: VpcProps) {
        super(scope, id);
        
        const subnets: SubnetConfiguration[] = []

        if (props.enablePublicSubnets) {
            subnets.push({
                subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
                name: "Public",
                cidrMask: 24,
            });
        }

        if (props.enablePrivateSubnets) {
            subnets.push({
                subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
                name: "Private",
                cidrMask: 24,
            });
        }

        new cdk.aws_ec2.Vpc(this, "VPC", {
            vpcName: props.name,
            availabilityZones: props.availabilityZones,
            subnetConfiguration: subnets,
            natGateways: props.natGateways,
        });

        // const resourceArns = vpc.publicSubnets.map(subnet => subnet.subnetId);
        // new aws_ram.CfnResourceShare(this, 'VPC-ResourceShare', {
        //     allowExternalPrincipals: false,
        //     name: props.name + '-ResourceShare',
        //     permissionArns: [],
        //     principals: [],
        //     resourceArns: resourceArns,
        // });
    }
}