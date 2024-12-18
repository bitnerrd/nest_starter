import { TimeSlots } from "src/entities/timeSlots/time-slots.entity";
import { define } from "typeorm-seeding";

define(TimeSlots, () => {
    return new TimeSlots();
  });
  