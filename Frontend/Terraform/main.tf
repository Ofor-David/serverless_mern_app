# provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "aws_s3_bucket" "example" {
  # bucket = "serverless-taskapp-bucket-0010909909099990"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
  force_destroy = true
  
  
}

# Enable versioning on the bucket
resource "aws_s3_bucket_versioning" "bucket-policy" {
  depends_on = [ aws_s3_bucket.example ]
  bucket = aws_s3_bucket.example.id

  versioning_configuration {
    status = "Enabled"
  } 
}

# block public access
resource "aws_s3_bucket_public_access_block" "public-access-block" {
  depends_on = [ aws_s3_bucket.example ]
  bucket = aws_s3_bucket.example.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM policy for S3 bucket
resource "aws_s3_bucket_policy" "allow-cloudfront" {
  bucket = aws_s3_bucket.example.id
  policy = data.aws_iam_policy_document.cloudfront-policy.json
  depends_on = [ aws_cloudfront_distribution.s3_distribution ]
}
data "aws_iam_policy_document" "cloudfront-policy" {
  statement {
    
    sid = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      aws_s3_bucket.example.arn,
      "${aws_s3_bucket.example.arn}/*",
    ]
    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [
        aws_cloudfront_distribution.s3_distribution.arn,
      ]
    }
  }
} 
# allow website hosting
resource "aws_s3_bucket_website_configuration" "website_hosting_rule" {
  depends_on = [ aws_s3_bucket.example ]
  bucket = aws_s3_bucket.example.id

  index_document {
    suffix = "index.html"
  }
}

locals {
  s3_origin_id = "myS3Origin"
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "example"
  description                       = "oac Policy"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
# cloudfront distribution
resource "aws_cloudfront_distribution" "s3_distribution" {
  depends_on = [ aws_s3_bucket.example ]

  origin {
    domain_name              = aws_s3_bucket.example.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    origin_id                = local.s3_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["HEAD", "GET"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}