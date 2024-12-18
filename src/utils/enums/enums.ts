export enum RoleEnum {
    user = 'user',
    admin = 'admin',
    sub_admin = 'sub-admin'
}

export enum SecurityCodeTypeEnum {
    verification = 'verification',
    forgot = 'forgot',
    otp = 'otp'
}

export enum ProfessionEnum {
    founder = 'founder',
    co_founder = 'co_founder',
    lawyer = 'lawyer',
    accountant = 'accountant'
}

export enum DaysNamesEnum {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday',
}

export const daysEnumNames = Object.values(DaysNamesEnum)
    .filter((i) => typeof i === 'string')
    .map((e) => e as string);

export enum PricingPlanEnum {
    basicPlan = 'Basic Plan',
    featuredPlan = 'Featured Plan',
}

export enum TenureEnum {
    yearly = 'yearly',
    monthly = 'monthly'
}

export enum AttachmentsTypeEnum {
    blog = 'blog',
    user = "user",
    admin_document = 'adminDocuments'
}
export enum WebhookPlatformEnum {
    stripe = 'stripe'
}

export enum WebhookPurposeEnum {
    setupIntent = 'setup-intent'
}

export enum ContactRequestStatusEnum {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    // BLOCKED = 'BLOCKED', // we will turn it on only if we have any scenarios related to blocking of the requests
    // DENIED = 'DENIED',
    CANCELED = 'CANCELED',
    REMOVED = 'REMOVED',
}


export enum NotificationType {
    email = 'email',
    sms = 'sms',
    push = 'push',
}

//TODO: need to update these accordingly
export enum NotificationCategory {
    UserCreation = 'user_creation',
    Chat = 'chat',
    ProfileUpdate = 'profile_update',
    Other = 'other',
}

export enum NewsletterSendTypeEnum {
    AllSubscribers = 'all',
    Selected = "selected"
}

export enum GuidlineTypeEnum {
    Terms_of_use = "termsOfUse",
    Terms_and_condition = 'termsAndCondition',
    Privacy_policy = 'privacyPolicy',
}