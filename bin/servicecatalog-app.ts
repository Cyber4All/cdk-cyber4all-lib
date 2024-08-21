import * as cdk from 'aws-cdk-lib';
import { ServicecatalogStack } from '../lib/servicecatalog-stack';
// import { VpcProduct } from '../lib/products/vpc-product-stack';

const app = new cdk.App();

new ServicecatalogStack(app, 'ServicecatalogStack');