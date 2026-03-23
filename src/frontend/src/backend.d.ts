import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type OrderId = string;
export interface Card {
    id: CardId;
    name: string;
    createdAt: bigint;
    description: string;
    stock: bigint;
    rarity: string;
    imageId: ExternalBlob;
    priceInCents: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShippingAddress {
    zip: string;
    street: string;
    country: string;
    city: string;
    name: string;
    email: string;
    state: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderHistoryUpdate {
    id: OrderId;
    status: OrderStatus;
    trackingNumber?: string;
}
export interface OrderHistory {
    id: OrderId;
    status: OrderStatus;
    trackingNumber?: string;
    createdAt: bigint;
    shippingAddress: ShippingAddress;
    buyer: Principal;
    cardIds: Array<CardId>;
    totalPrice: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Cart {
    createdAt: bigint;
    items: Array<CardId>;
    totalPrice: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type CardId = string;
export interface UserProfile {
    name: string;
}
export enum OrderStatus {
    shipped = "shipped",
    printing = "printing",
    pending = "pending",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(cardId: CardId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteCard(id: CardId): Promise<void>;
    getAllCards(): Promise<Array<Card>>;
    getAllOrders(): Promise<Array<OrderHistory>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCard(id: CardId): Promise<Card>;
    getCart(user: Principal): Promise<Cart | null>;
    getOrders(buyer: Principal): Promise<Array<OrderHistory>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    placeOrder(shippingAddress: ShippingAddress): Promise<OrderId>;
    removeFromCart(cardId: CardId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCard(card: Card): Promise<void>;
    updateOrderStatus(update: OrderHistoryUpdate): Promise<void>;
}
