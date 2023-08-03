import { Expose } from 'class-transformer'
import { IsHexColor, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PassTypesProps } from 'passkit-generator/lib/schemas'

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
  @IsHexColor()
  @Expose()
  foregroundColor: string
  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  @Expose()
  labelColor: string
  @IsString()
  @IsNotEmpty()
  @IsHexColor()
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
  @IsString()
  @IsOptional()
  @IsIn(['boardingPass', 'eventTicket', 'coupon', 'generic', 'storeCard'])
  type: PassTypesProps = 'eventTicket'
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
