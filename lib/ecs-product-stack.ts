import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';
import { ECSProps } from "./constructs/ecs";


export class ECSProductStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECSProps) {
    super(scope, id, props);

    
  }
}