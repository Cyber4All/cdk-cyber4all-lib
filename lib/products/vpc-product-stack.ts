import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs"
import { VPC } from "../constructs/vpc";

export class VPCProductStack extends cdk.aws_servicecatalog.ProductStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const name = new cdk.CfnParameter(this, 'Name', {
            type: "String",
            description: "The name of the VPC."
        });

        const publicSubnets = new cdk.CfnParameter(this, 'Enable Public Subnets', {
            type: "boolean",
            description: "True or False"

        });

        const privateSubnets = new cdk.CfnParameter(this, 'Enable Private Subnets', {
            type: "boolean",
            description: "True or False"
        });

        const availabilityZones = new cdk.CfnParameter(this, 'Availablity Zones', {
            type: "CommaDelimitedList",
            description: "The availability zones"
        });

        new VPC(scope, name.valueAsString, {
            enablePublicSubnets: Boolean(publicSubnets.valueAsString),
            enablePrivateSubnets: Boolean(privateSubnets.valueAsString),
            name: name.valueAsString,
            availabilityZones: availabilityZones.valueAsList,
            natGateways: 1,
        });
    }
}



