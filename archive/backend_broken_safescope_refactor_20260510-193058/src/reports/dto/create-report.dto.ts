import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class FindingDto {
  @IsString()
  @IsNotEmpty()
  hazardCategory: string;

  @IsString()
  @IsNotEmpty()
  severity: string;
}

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  inspector: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FindingDto)
  findings: FindingDto[];
}
