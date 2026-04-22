import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCorrectiveActionDto {
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @IsString()
  @IsOptional()
  classificationId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  priorityCode: 'low' | 'medium' | 'high' | 'urgent';

  @IsDateString()
  @IsOptional()
  dueDate: string;
}

export class CloseCorrectiveActionDto {
  @IsString()
  @IsNotEmpty()
  closureNotes: string;
}
