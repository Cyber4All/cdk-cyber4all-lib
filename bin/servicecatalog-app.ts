import * as cdk from 'aws-cdk-lib';
import { ServicecatalogStack } from '../lib/servicecatalog-stack';

const app = new cdk.App();

new ServicecatalogStack(app, 'ServicecatalogStack');