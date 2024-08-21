import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs"
import { Vpc } from "../constructs/vpc";

export class VpcProductStack extends cdk.aws_servicecatalog.ProductStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const name = new cdk.CfnParameter(scope, 'Name', {
            type: "String",
            description: "The name of the VPC."
        });

        const publicSubnets = new cdk.CfnParameter(scope, 'Enable Public Subnets', {
            type: "boolean",
            description: "True or False"

        });

        const privateSubnets = new cdk.CfnParameter(scope, 'Enable Private Subnets', {
            type: "boolean",
            description: "True or False"
        });

        // const availabilityZones = new cdk.CfnParameter(this, 'name', {
        //     type: "CommaDelimitedList",
        //     description: "The availability zones"
        // });

        new Vpc(scope, "vpc", {
            enablePublicSubnets: Boolean(publicSubnets.valueAsString),
            enablePrivateSubnets: Boolean(privateSubnets.valueAsString),
            name: name.valueAsString,
            availabilityZones: [],
            // availabilityZones: availabilityZones.valueAsList,
            natGateways: 1,
        });
    }
}