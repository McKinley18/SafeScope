import { IsString, MinLength } from 'class-validator';

export class ClassifyDto {
  @IsString()
  @MinLength(3)
  text!: string;
}
