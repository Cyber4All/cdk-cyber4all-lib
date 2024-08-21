import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { version } from '../package.json';
import { VpcProductStack } from './products/vpc-product-stack';

export interface PortfolioProps {
    /**
     * The name of the portfolio.
     */
    readonly portfolioName: string;

    /**
     * A description of the portfolio.
     */
    readonly description?: string;
    
    /**
     * A list of account IDs that should have access to this portfolio.
     * 
     * @default - Only the mgmt account can access the portfolio.
     */
    readonly accountIds?: string[];
}

export interface TagOption {
    key: string;
    values: string[];
}

export interface ProductProps {
    /**
     * The name of the product.
     */
    productName: string;

    /**
     * A description of the product.
     */
    description: string;

    /**
     * The ProductStack class to be used for the product.
     */
    productStack: cdk.aws_servicecatalog.ProductStack;
}

export interface ServicecatalogStackProps extends cdk.StackProps {
    readonly portfolios: PortfolioProps[];
    
    readonly tagOptions?: TagOption[];
}

export class ServicecatalogStack extends cdk.Stack {
    private portfolioDictionary: { [name: string]: cdk.aws_servicecatalog.Portfolio } = {};

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const portfolios = [
            {
                portfolioName: "Network Infrastucture",
                description: "This portfolio contains all network infrastructure products.",
                accountIds: ["353964526231"], // TODO: Replace with your account ID
                products: [
                    {
                        productName: "VPC Network",
                        description: "This product will create all the resources needed for an application VPC.",
                        productStack: new VpcProductStack(this, 'VpcProductStack')
                    }
                ]
            }
        ];
        const tagOptions: TagOption[] = [
            {
                key: "Environment",
                values: ["Dev", "Prod"]
            }
        ];
        
        // Create the portfolios
        for (let i = 0; i < portfolios.length; i++) {
            const portfolioObj = portfolios[i];
            const portfolio = this.createPortfolio("portfolio_" + i, portfolioObj, tagOptions);

            // Check if the portfolio already exists in the config
            // eslint-disable-next-line no-prototype-builtins
            if (this.portfolioDictionary.hasOwnProperty(portfolioObj.portfolioName)) {
                throw new Error(`${portfolioObj.portfolioName} portfolio is already exists in config`);
            }
            
            // Create the products in the portfolio
            for (let i = 0; i < portfolioObj.products.length; i++) {
                this.createProduct("product_" + i, portfolioObj.products[i], portfolio);
            }
        }
    }

    createPortfolio(id: string, portfolioProps: PortfolioProps, tagOptions?: TagOption[]): cdk.aws_servicecatalog.Portfolio {
        const { portfolioName, description, accountIds } = portfolioProps;

        // Create a new portfolio
        const portfolio = new cdk.aws_servicecatalog.Portfolio(this, id, {
            displayName: portfolioName,
            providerName: "Secured Inc.",
            description,
        });

        // Share the portfolio with the specified account IDs
        if (accountIds) {
            accountIds.forEach(accountId => {
                portfolio.shareWithAccount(accountId, {
                    shareTagOptions: true,
                });
            });
        }

        let roleIns = cdk.aws_iam.Role.fromRoleArn(this, id + "_role_1", "arn:aws:iam::590184083085:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSServiceCatalogEndUserAccess_c04b3af4e72d0a1c");
        portfolio.giveAccessToRole(roleIns)


        // Create & Associate TagOptions for the portfolio
        if (tagOptions) {
            portfolio.associateTagOptions(this.createTagOptions(id, tagOptions));
        }

        return portfolio;
    }

    createTagOptions(id: string, tagOptions: TagOption[]): cdk.aws_servicecatalog.TagOptions {
        const allowedValuesForTags: { [name: string]: string[] } = {};
        
        // Map the TagOptions to the expected CDK TagOptions format
        tagOptions.forEach((tagOption: TagOption) => {
            allowedValuesForTags[tagOption.key] = tagOption.values;
        });

        return new cdk.aws_servicecatalog.TagOptions(this, id + '_tagOption', {
            allowedValuesForTags
        });
    }

    /**
   * 
   * @param id This method used to create the Service Catalog Products
   * @param product 
   * @returns 
   */
  createProduct(id: string, productProps: ProductProps, portfolio: cdk.aws_servicecatalog.Portfolio): cdk.aws_servicecatalog.CloudFormationProduct {
    const { productName, description, productStack } = productProps;

    const template = cdk.aws_servicecatalog.CloudFormationTemplate.fromProductStack(productStack);

    const product = new cdk.aws_servicecatalog.CloudFormationProduct(this, id, {
        productName,
        description,
        owner: "Secured Inc.",
        productVersions: [
            {
                productVersionName: version,
                cloudFormationTemplate: template,
            },
        ]
    });

    portfolio.addProduct(product);

    return product;
  }

}