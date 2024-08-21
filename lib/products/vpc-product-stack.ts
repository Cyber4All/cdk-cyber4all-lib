import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs"

export interface VPCProductStackProps extends cdk.StackProps {
    readonly acceleratorPrefix: string;
}

export class VPCProductStack extends cdk.aws_servicecatalog.ProductStack {
    constructor(scope: Construct, id: string, props?: VPCProductStackProps) {
        super(scope, id);
    }
}

const name = new cdk.CfnParameter(this, 'name', {
    type: "String",
    description: "The name of the VPC."
})