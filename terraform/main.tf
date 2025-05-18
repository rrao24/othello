provider "aws" {
  region  = var.aws_region
}

resource "aws_s3_bucket" "destination_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "config" {
  bucket = aws_s3_bucket.destination_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.destination_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "ownership_controls" {
  bucket = aws_s3_bucket.destination_bucket.id
  rule {
    object_ownership = var.object_ownership
  }
}


resource "aws_s3_bucket_acl" "s3_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.ownership_controls]
  bucket     = aws_s3_bucket.destination_bucket.id
  acl        = "private"
}

resource "aws_cloudfront_origin_access_control" "oac" {
    name                              = "OAC"
    description                       = "OAC Controls"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
  }
  
resource "aws_cloudfront_distribution" "cdn" {
  enabled = true
  
  origin {
    domain_name              = aws_s3_bucket.destination_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    origin_id                = "origin-bucket-${aws_s3_bucket.destination_bucket.id}"
  }

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    min_ttl                = "0"
    default_ttl            = "3600"
    max_ttl                = "86400"
    target_origin_id       = "origin-bucket-${aws_s3_bucket.destination_bucket.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  custom_error_response {
    error_caching_min_ttl = 500
    error_code            = 404
    response_code         = "200"
    response_page_path    = "/index.html"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
    bucket = aws_s3_bucket.destination_bucket.id
    policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowCloudFrontReadFromS3",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "cloudfront.amazonaws.com"
        },
        "Action" : "s3:GetObject",
        "Resource" : "${aws_s3_bucket.destination_bucket.arn}/*",
        "Condition" : {
          "StringEquals" : {
            "AWS:SourceArn" : "${aws_cloudfront_distribution.cdn.arn}"
          }
        }
      }
    ]
  })
}

output "website_bucket_name" {
  value = aws_s3_bucket.destination_bucket.bucket
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.cdn.domain_name
}