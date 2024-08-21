import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs"
import { ProductProps } from "../servicecatalog-stack";
import { createInstance } from "../shared/create-instance";

export interface VPCProductStackProps extends cdk.StackProps {
    readonly acceleratorPrefix: string;
}

export class VpcProductStack extends cdk.aws_servicecatalog.ProductStack {
    constructor(scope: Construct, id: string, props?: VPCProductStackProps) {
        super(scope, id);

        const name = new cdk.CfnParameter(this, 'name', {
            type: "String",
            description: "The name of the VPC."
        });

        const publicSubnets = new cdk.CfnParameter(this, 'PublicSubnet', {
            type: "boolean",
            description: "The name of the public subnet"

        });

        const privateSubnets = new cdk.CfnParameter(this, 'PrivateSubnets', {
            type: "boolean",
            description: "The name of the private subnet"
        });

        const availabilityZones = new cdk.CfnParameter(this, 'name', {
            type: "String",
            description: "The name of the availabilty zone"
        });



    }
}

export const VpcProduct: ProductProps = {
    productName: "VPC",
    description: "This product creates a VPC.",
    portfolioName: "Network Infrastucture",
    productStack: VpcProductStack
}