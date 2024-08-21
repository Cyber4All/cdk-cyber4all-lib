import * as cdk from 'aws-cdk-lib';
import { ServicecatalogStack } from '../lib/servicecatalog-stack';

const app = new cdk.App();

new ServicecatalogStack(app, 'ServicecatalogStack', {
    portfolios: [
        {
            portfolioName: "Network Infrastucture",
            description: "This portfolio contains all network infrastructure products.",
            accountIds: ["123456789012"], // TODO: Replace with your account ID
        }
    ],
    products: [],

});