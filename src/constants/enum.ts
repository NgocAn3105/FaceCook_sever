export enum UserVerifyStatus {
    Unverified = '0',
    Verified = '1',
    Banned = '2'
}

export enum TokenType {
    Access = 'access',
    Refresh = 'refresh',
    ForgotPassword = 'forgot_password',
    EmailVerify = 'email_verify'
}

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    DOCUMENT = 'document'
}

export enum TweetType {
    Tweet = 'tweet',
    Retweet = 'retweet',
    Comment = 'comment',
    QuoteTweet = 'quote_tweet'
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator'
}

export enum UserStatus {
    ACTIVE = 'active',
    BANNED = 'banned',
    PENDING = 'pending',
    DELETED = 'deleted'
}

export enum NotificationType {
    LIKE = 'like',
    COMMENT = 'comment',
    FOLLOW = 'follow',
    MENTION = 'mention'
}

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    CASH = 'cash'
}

export enum ErrorCode {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

export enum Like_enum {
    like = 'like',
    haha = 'haha',
    love = 'love',
    sad = 'sad',
    angry = 'angry'
}