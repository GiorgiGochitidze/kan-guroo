import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ItemDocument = Item & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Item {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, index: true })
  category?: string;

  @Prop({ enum: ["active", "inactive"], default: "active" })
  status?: "active" | "inactive";

  @Prop({ default: 0 })
  price?: number;

  @Prop({ default: () => new Date(), index: true })
  createdAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
