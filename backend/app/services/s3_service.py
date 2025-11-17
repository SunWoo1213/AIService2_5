"""
AWS S3 Service
"""
import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import uuid


class S3Service:
    """Service for AWS S3 operations"""
    
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket = settings.AWS_S3_BUCKET
    
    def upload_file(self, file_content: bytes, file_key: str, content_type: str = "application/octet-stream") -> str:
        """
        Upload file to S3
        Returns: Public URL of uploaded file
        """
        try:
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=file_key,
                Body=file_content,
                ContentType=content_type
            )
            
            url = f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{file_key}"
            return url
        
        except ClientError as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")
    
    def generate_presigned_url(self, file_key: str, expiration: int = 3600) -> str:
        """
        Generate presigned URL for private file access
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': file_key},
                ExpiresIn=expiration
            )
            return url
        
        except ClientError as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")
    
    def delete_file(self, file_key: str):
        """
        Delete file from S3
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket,
                Key=file_key
            )
        
        except ClientError as e:
            raise Exception(f"Failed to delete file from S3: {str(e)}")
    
    @staticmethod
    def generate_file_key(prefix: str, filename: str) -> str:
        """
        Generate unique file key
        """
        unique_id = str(uuid.uuid4())
        extension = filename.split('.')[-1] if '.' in filename else ''
        return f"{prefix}/{unique_id}.{extension}" if extension else f"{prefix}/{unique_id}"


# Singleton instance
s3_service = S3Service()

