variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "bucket_name" {
  description = "Name of S3 Bucket to Deploy"
  type = string
}

variable "object_ownership" {
  description = "S3 ownership controls"
  type = string
}