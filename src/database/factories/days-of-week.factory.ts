import { DaysEntity } from "src/entities/daysOfWeek/days-of-week.entity";
import { define } from "typeorm-seeding";

define(DaysEntity, () => {
    return new DaysEntity();
  });
  