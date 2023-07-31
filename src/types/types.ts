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
