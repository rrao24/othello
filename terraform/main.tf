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