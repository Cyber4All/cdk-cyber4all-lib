import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs"
import { Vpc } from "../constructs/vpc";

export class VpcProductStack extends cdk.aws_servicecatalog.ProductStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const name = new cdk.CfnParameter(this, 'Name', {
            type: "String",
            description: "The name of the VPC.",
            default: "MyVPC"
        });

        const publicSubnets = new cdk.CfnParameter(this, 'Enable Public Subnets', {
            type: "String",
            description: "True or False",
            default: true
        });

        const privateSubnets = new cdk.CfnParameter(this, 'Enable Private Subnets', {
            type: "String",
            description: "True or False",
            default: true
        });

        // const availabilityZones = new cdk.CfnParameter(this, 'Availablity Zones', {
        //     type: "CommaDelimitedList",
        //     description: "The availability zones"
        // });

        new Vpc(this, "vpc", {
            enablePublicSubnets: Boolean(publicSubnets.valueAsString),
            enablePrivateSubnets: Boolean(privateSubnets.valueAsString),
            name: name.valueAsString,
            availabilityZones: [],
            // availabilityZones: availabilityZones.valueAsList,
            natGateways: 1,
        });
    }
}