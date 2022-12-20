import { IsNumber, IsString } from 'class-validator';

export class CreateReplyDto {
    @IsNumber()
    readonly letterBodyId: number;
    
@IsString()
  readonly content: string;
}
