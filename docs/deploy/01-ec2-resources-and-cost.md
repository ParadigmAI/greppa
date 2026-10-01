# AWS resources — Phase 1 EC2 deployment

What's actually running in AWS for `greppa.app`, and what it costs. Written
2026-10-01, right after the first live deploy (see `CLAUDE.md`'s status log
for the narrative version, including the two bugs hit along the way).

- **Account:** `741375879015`
- **IAM user used to provision:** `greppa` (policy: `AmazonEC2FullAccess` only — no SSM, which is why access is via SSH rather than Session Manager)
- **Region:** `us-east-1` (N. Virginia)
- **Live URL:** `http://100.63.10.70/` (plain HTTP — no domain or TLS yet)

## Resource inventory

| Resource | ID | Spec | Purpose |
|---|---|---|---|
| EC2 instance | `i-04e7cc68e3253ba96` | `t3.small`, Amazon Linux 2023 (AMI `ami-0d27e0fb3bac4d724`), AZ `us-east-1a`, IMDSv2 enforced (hop limit 2) | Runs the Docker container for the landing page |
| EBS volume | `vol-0297c87dcb4226555` | `gp3`, 20 GB, encrypted, 3,000 IOPS / 125 MB/s (both baseline, unpaid) | Root volume — OS, Docker images, the SQLite waitlist DB |
| Elastic IP | `eipalloc-03581496be3d20ba1` | `100.63.10.70`, associated with the instance | Stable public address so the IP doesn't change on instance stop/start |
| Security group | `sg-050c6930c1486c37b` (`greppa-web-sg`) | 22/tcp from the deploying machine's IP only; 80/tcp and 443/tcp from `0.0.0.0/0` | Firewall — SSH locked down, web ports open since this is a public site |
| Key pair | `greppa-deploy` (`key-073911725e4578c03`) | ed25519 | SSH access to the instance. Private half lives at `~/.ssh/greppa-deploy.pem` on the operator's machine — **not** in this repo |
| VPC / subnet | `vpc-0d0856f7e766d8760` / `subnet-035c88661b67bceed` | Default VPC, default public subnet | No new networking was created — this deploy reuses the account's default VPC |

Not an AWS resource, but adjacent: GitHub access from the instance uses a
dedicated SSH deploy key generated *on the instance itself* (the private key
never left it) and registered as a **read-only** Deploy Key on the
`miranthajayatilake/greppa` repo — not a personal access token.

## Estimated monthly cost

Pricing researched for `us-east-1`, current as of 2026-10-01. On-demand, no
Reserved/Savings Plan commitment, assumed running 24/7 (730 hours/month).

| Resource | Rate | Monthly estimate |
|---|---|---|
| EC2 `t3.small` (on-demand, Linux) | $0.0208/hour | **$15.18** |
| EBS `gp3`, 20 GB | $0.08/GB-month | **$1.60** |
| Elastic IP (in use, attached to a running instance) | $0.005/IPv4-hour — AWS now charges this for **every** public IPv4, attached or not, since Feb 2024 | **$3.65** |
| Data transfer out to the internet | First 100 GB/month free (AWS account-wide free tier), then $0.09/GB | **~$0** at expected waitlist-page traffic levels |
| Security group, key pair, VPC/subnet (default) | — | **$0** (no charge) |
| **Total** | | **≈ $20.43/month** |

A few things that would change this number:

- **If this AWS account is less than 12 months old**, `t3.micro` (not
  `t3.small`) is free-tier eligible — 750 hours/month free for the first
  year. This deploy intentionally used `t3.small` (2 GB RAM) because `next
  build` inside the Docker build comfortably needs more headroom than
  `t3.micro`'s 1 GB offers reliably; `t3.micro` would risk the build getting
  OOM-killed. If cost matters more than build-time safety margin here, the
  build could be done once on a larger instance and the image pushed to a
  registry, then run on `t3.micro` — more moving parts than this phase's
  "keep it simple" deploy philosophy calls for, so not done.
- **A Reserved Instance or Savings Plan** (1- or 3-year commitment) would cut
  the EC2 line by roughly 30–60%, if this becomes a long-running production
  box rather than a Phase 1 landing page.
- **Traffic beyond 100 GB/month out** adds $0.09/GB — unlikely for a waitlist
  page unless it goes viral.
- **TLS/custom domain** (Caddy, per `DEPLOY.md`) adds no AWS cost by itself —
  Let's Encrypt certificates are free. A Route 53 hosted zone, if DNS also
  moves to AWS, is $0.50/month per zone plus negligible query cost.

## If you want to tear this down

```bash
# Release the Elastic IP (stops the $3.65/month charge) — do this AFTER terminating the instance
aws ec2 disassociate-address --association-id eipassoc-0391b069dbc407802
aws ec2 release-address --allocation-id eipalloc-03581496be3d20ba1

# Terminate the instance (also deletes the EBS volume — root volumes delete-on-termination by default)
aws ec2 terminate-instances --instance-ids i-04e7cc68e3253ba96

# Clean up the security group and key pair
aws ec2 delete-security-group --group-id sg-050c6930c1486c37b
aws ec2 delete-key-pair --key-name greppa-deploy
```

Don't run these unless you actually mean to tear the deployment down — they're
here for reference, not as a routine step.
