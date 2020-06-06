import { Model } from "@nozbe/watermelondb";
import { tableNames } from ".";

  
  export class Organization extends Model {
    static table = tableNames.organizations;
  }