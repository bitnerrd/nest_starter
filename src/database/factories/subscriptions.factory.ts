import { DaysEntity } from "src/entities/daysOfWeek/days-of-week.entity";
import { SubscriptionsEntity } from "src/entities/subscriptions/subscriptions.entity";
import { define } from "typeorm-seeding";

export const SubscriptionsSeed = [
  {
    planType: 'Basic Plan',
    amount: 30,
    features: {
      accessToAllLegalDocuments: true,
      downloadInDocFormat: true,
      lawyerService: false,
      helpWithDraftingBespokeLegalDocuments: false,
      twoLegalCounselWithACertifiedLawyer: false
    },
    tenure: 'monthly'
  },
  {
    planType: 'Featured Plan',
    amount: 200,
    features: {
      accessToAllLegalDocuments: true,
      downloadInDocFormat: true,
      lawyerService: true,
      helpWithDraftingBespokeLegalDocuments: true,
      twoLegalCounselWithACertifiedLawyer: true
    },
    tenure: 'monthly'
  }
]

define(SubscriptionsEntity, () => {
  return new SubscriptionsEntity();
});
