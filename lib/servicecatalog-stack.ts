import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { version } from '../package.json';

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
     * The name of the portfolio to which the product should be added.
     */
    portfolioName: string;

    /**
     * The ProductStack class to be used for the product.
     */
    productStack: new (scope: Construct, id: string) => cdk.aws_servicecatalog.ProductStack;
}

export interface ServicecatalogStackProps extends cdk.StackProps {
    readonly portfolios: PortfolioProps[];
    
    readonly products: ProductProps[];

    readonly tagOptions?: TagOption[];
}

export class ServicecatalogStack extends cdk.Stack {
    private portfolioDictionary: { [name: string]: cdk.aws_servicecatalog.Portfolio } = {};

    constructor(scope: Construct, id: string, props: ServicecatalogStackProps) {
        super(scope, id, props);

        const { portfolios, products, tagOptions } = props;
        
        // Create the portfolios
        for (let i = 0; i < portfolios.length; i++) {
            const portfolioObj = portfolios[i];
            const portfolio = this.createPortfolio("portfolio_" + i, portfolioObj, tagOptions);

            // Check if the portfolio already exists in the config
            // eslint-disable-next-line no-prototype-builtins
            if (this.portfolioDictionary.hasOwnProperty(portfolioObj.portfolioName)) {
                throw new Error(`${portfolioObj.portfolioName} portfolio is already exists in config`);
            }
            
            // Add the portfolio to the dictionary
            this.portfolioDictionary[portfolioObj.portfolioName] = portfolio;
        }

        // Create the products
        for (let i = 0; i < products.length; i++) {
            this.createProduct("product_" + i, products[i]);
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
                portfolio.shareWithAccount(accountId);
            });
        }

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
  createProduct(id: string, productProps: ProductProps) {
    const { productName, description, productStack, portfolioName } = productProps;

    // Instantiates the product stack class
    const productClass = new productStack(this, id);

    const product = new cdk.aws_servicecatalog.CloudFormationProduct(this, id, {
        productName,
        description,
        owner: "Secured Inc.",
        productVersions: [
            {
                productVersionName: version,
                cloudFormationTemplate: cdk.aws_servicecatalog.CloudFormationTemplate.fromProductStack(productClass),
            },
        ]
    });

    // Add the product to the portfolio
    const portfolio = this.portfolioDictionary[portfolioName];
    if (!portfolio) {
      throw new Error(`${portfolioName} protfolio is not exists in config. Make sure config with name is exists`);
    }
    portfolio.addProduct(product);

    return product;
  }

}