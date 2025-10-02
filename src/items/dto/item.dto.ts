import { Type } from "class-transformer";
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  status: "active" | "inactive";

  @IsInt()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price: number;

  @IsDate()
  @IsString()
  createdAt: Date;
}
