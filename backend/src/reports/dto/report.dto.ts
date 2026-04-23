import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateReportDto {
  @IsString()
  @IsOptional()
  siteId?: string;

  @IsString()
  @IsOptional()
  sourceType?: string;

  @IsDateString()
  @IsOptional()
  eventDatetime?: string;

  @IsString()
  @IsOptional()
  eventTypeCode?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  narrative?: string;

  @IsString()
  @IsOptional()
  reportStatus?: string;

  @IsString()
  @IsOptional()
  hazardDescription?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsString()
  @IsOptional()
  workActivity?: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsBoolean()
  @IsOptional()
  immediateDanger?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}

export class CreateReportAttachmentDto {
  @IsString()
  @IsNotEmpty()
  uri: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsString()
  @IsOptional()
  fileName?: string;
}

export class AddReportEvidenceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportAttachmentDto)
  attachments: CreateReportAttachmentDto[];
}
