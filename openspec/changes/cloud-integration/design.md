# Cloud Integration Design

## Context
Currently, Notify Me runs locally with SQLite. This design outlines a container-based approach using Azure's free tier to provide a scalable, reliable, and cost-effective cloud solution.

## Goals
- **Containerize** the application using Docker
- **Deploy** to Azure's free tier services
- **Automate** CI/CD with GitHub Actions
- **Monitor** application health and costs
- **Stay** within free tier limits
- Maintain cost-effectiveness

## Non-Goals
- Complete migration to serverless architecture
- Multi-region deployment in initial phase
- Complete vendor lock-in

## Architecture

### Target Cloud Provider: Azure
Primary services to be used (Free Tier):
- **Compute**: Azure App Service (Linux Containers)
- **Container Registry**: Azure Container Registry (ACR)
- **Database**: Azure Database for PostgreSQL (Free Tier)
- **Storage**: Azure Blob Storage (5GB free)
- **Networking**: Azure Virtual Network, Application Gateway
- **CI/CD**: GitHub Actions with Azure Pipelines
- **Monitoring**: Azure Monitor (Free Tier)
- **Secrets**: Azure Key Vault

### Container Architecture
```
[GitHub] → [GitHub Actions] → [Azure Container Registry] 
    → [Azure App Service (Containers)] 
    → [Azure Database for PostgreSQL]
```

### Free Tier Limits
- **App Service**: 10 web apps (60 minutes/day)
- **Database**: 32GB storage (12 months free)
- **Container Registry**: 500MB storage
- **Bandwidth**: 5GB outbound/month

### High-Level Architecture
```
[User] → [CloudFront CDN] → [Application Load Balancer] → [ECS Fargate Containers]
                                      ↓
                              [RDS PostgreSQL]
                                      ↓
                              [S3 Storage]
```

## Decisions

### Containerization
- **Decision**: Use Docker containers for application packaging
- **Rationale**: Ensures consistent environments across development and production
- **Implementation**: Multi-stage Dockerfile to keep image size small

### Database
- **Decision**: Migrate from SQLite to PostgreSQL on RDS
- **Rationale**: Better performance, reliability, and maintenance
- **Migration**: Use Alembic for database migrations

### Containerization
- **Decision**: Use Docker with multi-stage builds
- **Rationale**: Smaller image size, better security, and faster deployments

### Infrastructure as Code
- **Decision**: Use Bicep for Azure resource provisioning
- **Rationale**: Native Azure support, better integration with Azure services

### CI/CD
- **Decision**: GitHub Actions with Azure Pipelines
- **Rationale**: Native GitHub integration with Azure services, free tier available
- **Workflow**: Build → Push to ACR → Deploy to App Service

## Security Considerations
- All traffic encrypted in transit (HTTPS)
- IAM roles with least privilege
- Database encryption at rest
- Regular security scanning of container images
- Secrets management using AWS Secrets Manager

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vendor lock-in | Medium | Use container-based deployment for portability |
| Cost overruns | High | Set up budget alerts and monitor usage |
| Data migration | High | Thorough testing of migration scripts |
| Downtime | High | Blue-green deployment strategy |

## Migration Plan
1. Set up development environment in cloud
2. Migrate database schema and data
3. Deploy application in parallel with existing setup
4. Test thoroughly in staging
5. Cut over DNS in small batches
6. Monitor closely and have rollback plan

## Open Questions
- Should we implement a CDN for static assets?
- What are the expected peak loads we need to handle?
- Do we need a separate database for analytics?
- What are the compliance requirements for data storage?
