import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as iam from '@aws-cdk/aws-iam'
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { SubnetType } from '@aws-cdk/aws-ec2';
import * as path from 'path';

export class DreamjobApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // get the default VPC in this region
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcName: 'CdkStackStack/VPC',
    });

    // setup a cluster for fargate to use
    const cluster = new ecs.Cluster(this, 'ApiCluster', {
      vpc: vpc
    });

    // get the arn of the rds secrets
    const rdsSecretsArn = cdk.Fn.importValue('DbSecretsArn');

    // import the RDS secrets using their full arn
    const secret = secretsmanager.Secret.fromSecretCompleteArn(this, 'RdsSecretsFromCompleteArn', rdsSecretsArn);

    // create the task role
    const ecsTaskRole = new iam.Role(this, 'BackendTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });

    // grant the role read access for secrets
    secret.grantRead(ecsTaskRole)

    /** Currently no good way to natively create a repo and publish to it in the cdk */
    // const repo = new ecr.Repository(this, 'BackendRepo', {
    //   imageScanOnPush: true
    // })

    // upload the initial docker image (this also creates an ecr repo)
    // const asset = new DockerImageAsset(this, 'BackendImage', {
    //   directory: path.join(__dirname, '..', '..', '..')
    // })

    // declare the task definiton/alb for fargate
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'RestApiFargate', {
      cluster: cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', '..', '..')),
        containerPort: 3001,
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
      },
      memoryLimitMiB: 512,
      publicLoadBalancer: false,
      taskSubnets: {
        subnetType: SubnetType.PRIVATE
      }
    });

    // I'm 27% sure vpc link is free
    const vpcLink = new apigw.VpcLink(this, 'VpcLink', {
      vpc: vpc
    });

    const httpIntegration = new HttpAlbIntegration({
      listener: service.listener,
      vpcLink: vpcLink
    })

    const httpEndpoint = new HttpApi(this, 'HttpProxyPrivateApi', {
      defaultIntegration: httpIntegration
    })

    httpEndpoint.addRoutes({
      path: '/api/{any+}', // need to be any
      methods: [HttpMethod.ANY],
      integration: httpIntegration
    })
  }
}
