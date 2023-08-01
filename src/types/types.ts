import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class Template {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string
  @IsString()
  @IsNotEmpty()
  @Expose()
  foregroundColor: string
  @IsString()
  @IsNotEmpty()
  @Expose()
  labelColor: string
  @IsString()
  @IsNotEmpty()
  @Expose()
  backgroundColor: string
}

export class PassQuery {
  @IsString()
  @IsNotEmpty()
  userId: string
  @IsString()
  @IsNotEmpty()
  name: string
}

export interface GenerateDto {
  passPath?: string
}

export type GoogleCredentials = {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain: string
}
