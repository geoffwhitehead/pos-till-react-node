import { tableSchema, Model } from "@nozbe/watermelondb";

export interface ItemProps {
    _id: string;
    name: string;
    category_id: string;
    price: number;
    modifier_id?: string;
    printers_id: string;
  }
  
