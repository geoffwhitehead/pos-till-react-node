import { Model } from "@nozbe/watermelondb";
import { tableNames } from ".";
import { nochange, field } from "@nozbe/watermelondb/decorators";

export class Discount extends Model {
    static table = tableNames.discounts;
  
    @nochange @field('name') name;
    @nochange @field('amount') amount;
    @nochange @field('is_percent') isPercent;
  }
