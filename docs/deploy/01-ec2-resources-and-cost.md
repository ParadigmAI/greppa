# AWS resources — Phase 1 EC2 deployment

What's actually running in AWS for `greppa.app`, and what it costs. Written
2026-10-01, right after the first live deploy; updated the same day after
resizing from `t3.small` to `t3.micro` (see `CLAUDE.md`'s status log for the
full narrative, including the bugs hit along the way).

- **Account:** `741375879015`
- **IAM user used to provision:** `greppa` (policy: `AmazonEC2FullAccess` only — no SSM, which is why access is via SSH rather than Session Manager)
- **Region:** `us-east-1` (N. Virginia)
- **Live URL:** `http://100.63.10.70/` (plain HTTP — no domain or TLS yet)

## Resource inventory

| Resource | ID | Spec | Purpose |
|---|---|---|---|
| EC2 instance | `i-04e7cc68e3253ba96` | `t3.micro`, Amazon Linux 2023 (AMI `ami-0d27e0fb3bac4d724`), AZ `us-east-1a`, IMDSv2 enforced (hop limit 2) | Runs the Docker container for the landing page |
| EBS volume | `vol-0297c87dcb4226555` | `gp3`, 20 GB, encrypted, 3,000 IOPS / 125 MB/s (both baseline, unpaid) | Root volume — OS, Docker images, the SQLite waitlist DB |
| Swapfile | `/swapfile` on the instance (not a separate AWS resource — lives on the EBS volume above) | 2 GB, persisted via `/etc/fstab` | Safety net so `next build` inside the Docker build doesn't get OOM-killed on `t3.micro`'s 1 GB RAM — confirmed necessary: a real rebuild peaked at 142 MB of swap in use |
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
| EC2 `t3.micro` (on-demand, Linux) | $0.0104/hour | **$7.59** (**$0** if this account is within its 12-month Free Tier window — see below) |
| EBS `gp3`, 20 GB | $0.08/GB-month | **$1.60** |
| Elastic IP (in use, attached to a running instance) | $0.005/IPv4-hour — AWS now charges this for **every** public IPv4, attached or not, since Feb 2024 | **$3.65** |
| Data transfer out to the internet | First 100 GB/month free (AWS account-wide free tier), then $0.09/GB | **~$0** at expected waitlist-page traffic levels |
| Security group, key pair, VPC/subnet (default), swapfile | — | **$0** (no charge) |
| **Total** | | **≈ $12.84/month** (**≈ $5.25/month** if the EC2 Free Tier applies) |

**Why this changed from the original $20.43/month estimate:** the deploy
started on `t3.small` (2 GB RAM) because `next build` needs more than
`t3.micro`'s 1 GB to run reliably. At the user's request — "okay for the
website to be slow initially, it's just a landing page" — it was resized
down to `t3.micro` in place (stop → `modify-instance-attribute` → start; the
EBS volume and Elastic IP are untouched by an instance-type change, no data
lost) and a 2 GB swapfile was added as a safety net for the build step. This
was then **verified with a real no-cache rebuild**, not just assumed safe:
the `next build` step took ~75s (vs ~20s on `t3.small`) and peaked at 142 MB
of swap in use — confirming both that it works and that the swapfile is
genuinely needed, not just precautionary.

**To check Free Tier eligibility yourself:** the IAM user this was deployed
with (`greppa`, `AmazonEC2FullAccess` only) doesn't have Billing or Cost
Explorer permissions, so this couldn't be checked programmatically. Check the
[Billing Console's Free Tier page](https://console.aws.amazon.com/billing/home#/freetier)
— free tier for EC2 applies only within 12 months of the **AWS account's**
creation date (not the IAM user's).

A few other things that would change this number:

- **A Reserved Instance or Savings Plan** (1- or 3-year commitment) would cut
  the EC2 line further, if this becomes a long-running production box rather
  than a Phase 1 landing page.
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
