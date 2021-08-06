import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets'
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as apigwIntegrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as iam from '@aws-cdk/aws-iam'
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { SubnetType } from '@aws-cdk/aws-ec2';
import { Compatibility } from '@aws-cdk/aws-ecs';
import { Aws } from '@aws-cdk/core';
import * as ssm from '@aws-cdk/aws-ssm';
import * as rds from '@aws-cdk/aws-rds';
// require('../../..')
import * as path from 'path';

// export interface BackendProps extends cdk.StackProps {
  
// }

export class DreamjobApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // import the vpc id
    // const vpcId = cdk.Fn.importValue('VpcId')
    // const vpcId = ssm.StringParameter.valueFromLookup(this, '/Dreamjob/VpcId');
    // ssm.StringParameter.val

    // get the default VPC in this region
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcName: 'CdkStackStack/VPC',
      // isDefault: false
      // vpcId: 'vpc-091e0be8440d9bcb2'
    });

    // setup a cluster for fargate to use
    const cluster = new ecs.Cluster(this, 'ApiCluster', {
      vpc: vpc
    });

    // get the arn of the rds secrets
    const rdsSecretsArn = cdk.Fn.importValue('DbSecretsArn');

    // import the RDS secrets using their full arn
    const secret = secretsmanager.Secret.fromSecretCompleteArn(this, 'RdsSecretsFromCompleteArn', rdsSecretsArn);
    // const dbCredentials = secret.secretValue.toJSON();
    // console.log('creds', dbCredentials);
    // console.log('secret', secret);

    // new ssm.StringParameter(this, 'Parameter', {
    //   parameterName: 'TestParam',
    //   stringValue: secret.secretValue.toString()
    // })

    // START TEMP

    // create the task role
    const ecsTaskRole = new iam.Role(this, 'BackendTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });

    // grant the role read access for secrets
    secret.grantRead(ecsTaskRole)

    // Currently no good way to natively create a repo and publish to it in the cdk
    // const repo = new ecr.Repository(this, 'BackendRepo', {
    //   imageScanOnPush: true
    // })

    // upload the initial docker image (this also creates an ecr repo)
    // const asset = new DockerImageAsset(this, 'BackendImage', {
    //   directory: path.join(__dirname, '..', '..', '..')
    // })

    // should grant read to a user here for ecr

    // need to get the subnet id from the rds
    // const subnet = ec2.Subnet.fromSubnetId(this, 'PrivateSubnet', 's-example-id')

    // declare the task definiton/alb for fargate
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'RestApiFargate', {
      cluster: cluster,
      
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        // image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        // image: ecs.ContainerImage.fromEcrRepository(repo, 'api:latest'),
        // image: ecs.ContainerImage.fromEcrRepository(asset.repository),
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', '..', '..')),
        containerPort: 3001, // CHECK LATER
        environment: {
          database: 'dreamjobDB'
        },
        taskRole: ecsTaskRole,
        // set the db credentials as secrets in the container
        secrets: {
          engine: ecs.Secret.fromSecretsManager(secret, 'engine'),
          host: ecs.Secret.fromSecretsManager(secret, 'host'),
          user: ecs.Secret.fromSecretsManager(secret, 'username'),
          password: ecs.Secret.fromSecretsManager(secret, 'password')
        }
      }, // ADD ACTUAL IMAGE LATER
      memoryLimitMiB: 512,
      publicLoadBalancer: false,
      // not sure if we need to do it like this or not
      taskSubnets: {
        subnetType: SubnetType.PRIVATE
        // subnets: [
        //   subnet
        // ]
      }
      // taskSubnets
      // listenerPort 
    });

    // service.loadBalancer.addListener('listener', { port: 80 })
    //   .addTargets('target', { port: 3001 });

    // I'm 27% sure vpc link is free
    const vpcLink = new apigw.VpcLink(this, 'VpcLink', {
      vpc: vpc
    });

    const httpIntegration = new HttpAlbIntegration({
      listener: service.listener,
      vpcLink: vpcLink
    })

    const httpEndpoint = new HttpApi(this, 'HttpProxyPrivateApi', {
      // defaultIntegration: new HttpAlbIntegration({
      //   listener: service.listener // not sure if this is right
      // })
      defaultIntegration: httpIntegration
    })

    httpEndpoint.addRoutes({
      path: '/api/{any+}', // need to be any
      methods: [HttpMethod.ANY],
      integration: httpIntegration // really not sure here the docs are terrible
    })

    // const httpApi = new HttpApi(this, 'HttpApi')

    // httpApi.addRoutes({
    //   path: '/{any+}',
    //   methods: [HttpMethod.ANY],
    //   integration: 
    // })
  }
}
