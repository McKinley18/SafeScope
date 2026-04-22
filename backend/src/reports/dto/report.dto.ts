import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  siteId: string;

  @IsString()
  @IsOptional()
  sourceType: string;

  @IsDateString()
  eventDatetime: string;

  @IsString()
  @IsNotEmpty()
  eventTypeCode: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  narrative: string;
}
