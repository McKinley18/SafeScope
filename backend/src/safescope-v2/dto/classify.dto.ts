import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class ClassifyDto {
  @IsString()
  @MinLength(2)
  text!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];
}
