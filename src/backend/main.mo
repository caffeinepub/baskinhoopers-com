import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)

actor {
  module Card {
    public func compare(card1 : Card, card2 : Card) : Order.Order {
      Text.compare(card1.id, card2.id);
    };
  };

  module OrderHistory {
    public func compareByCreatedAt(history1 : OrderHistory, history2 : OrderHistory) : Order.Order {
      switch (Nat.compare(history1.createdAt, history2.createdAt)) {
        case (#equal) { Text.compare(history1.id, history2.id) };
        case (order) { order };
      };
    };

    public func compareByMostRecent(history1 : OrderHistory, history2 : OrderHistory) : Order.Order {
      compareByCreatedAt(history2, history1);
    };
  };

  // -------- Custom Data --------
  type CardId = Text;
  type OrderId = Text;

  public type Card = {
    id : CardId;
    priceInCents : Nat;
    name : Text;
    description : Text;
    rarity : Text;
    imageId : Storage.ExternalBlob;
    stock : Nat;
    createdAt : Nat;
  };

  public type ShippingAddress = {
    name : Text;
    email : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  public type OrderStatus = {
    #pending;
    #printing;
    #shipped;
    #delivered;
  };

  public type OrderHistory = {
    id : OrderId;
    buyer : Principal;
    cardIds : [CardId];
    totalPrice : Nat;
    createdAt : Nat;
    shippingAddress : ShippingAddress;
    status : OrderStatus;
    trackingNumber : ?Text;
  };

  public type OrderHistoryUpdate = {
    id : OrderId;
    status : OrderStatus;
    trackingNumber : ?Text;
  };

  public type Cart = {
    items : [CardId];
    totalPrice : Nat;
    createdAt : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // --------- State ---------
  // Data
  let cards = Map.empty<CardId, Card>();
  let carts = Map.empty<Principal, Cart>();
  let orders = Map.empty<OrderId, OrderHistory>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // --------- Component Features ---------
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // --------- Stripe Integration ---------
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // --------- User Profiles ---------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --------- Cards ---------
  public query ({ caller }) func getAllCards() : async [Card] {
    cards.values().toArray().sort();
  };

  public query ({ caller }) func getCard(id : CardId) : async Card {
    switch (cards.get(id)) {
      case (null) { Runtime.trap("Card not found") };
      case (?card) { card };
    };
  };

  public shared ({ caller }) func updateCard(card : Card) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (card.priceInCents == 0) { Runtime.trap("Price cannot be zero") };
    if (card.name == "" or card.description == "" or card.rarity == "") {
      Runtime.trap("Fields cannot be empty");
    };
    cards.add(card.id, card);
  };

  public shared ({ caller }) func deleteCard(id : CardId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not cards.containsKey(id)) { Runtime.trap("Card not found") };
    cards.remove(id);
  };

  // --------- Shopping Cart ---------
  func ensureCartExists(user : Principal) {
    switch (carts.get(user)) {
      case (null) {
        carts.add(user, { items = []; totalPrice = 0; createdAt = Time.now().toNat() });
      };
      case (?_) {};
    };
  };

  public shared ({ caller }) func addToCart(cardId : CardId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let card = switch (cards.get(cardId)) {
      case (null) { Runtime.trap("Card not found") };
      case (?card) { card };
    };
    ensureCartExists(caller);
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };
    let items = cart.items.concat([cardId]);
    let totalPrice = arraySum(items.map(func(id) { switch (cards.get(id)) { case (null) { Runtime.trap("Card not found") }; case (?card) { card.priceInCents } } }));
    let updated = { items; totalPrice; createdAt = cart.createdAt };
    carts.add(caller, updated);
  };

  public shared ({ caller }) func removeFromCart(cardId : CardId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    ensureCartExists(caller);
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };
    let items = cart.items.filter(func(id) { id != cardId });
    let totalPrice = arraySum(items.map(func(id) { switch (cards.get(id)) { case (null) { Runtime.trap("Card not found") }; case (?card) { card.priceInCents } } }));
    let updated = { items; totalPrice; createdAt = cart.createdAt };
    carts.add(caller, updated);
  };

  public query ({ caller }) func getCart(user : Principal) : async ?Cart {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own cart");
    };
    carts.get(user);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    ensureCartExists(caller);
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };
    carts.add(caller, { items = []; totalPrice = 0; createdAt = cart.createdAt });
  };

  // --------- Orders ---------
  public shared ({ caller }) func placeOrder(shippingAddress : ShippingAddress) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    ensureCartExists(caller);
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };
    if (cart.items.isEmpty()) { Runtime.trap("Cart is empty") };

    // Check stock and reduce it
    for (cardId in cart.items.values()) {
      let card = switch (cards.get(cardId)) {
        case (null) { Runtime.trap("Card not found: " # cardId) };
        case (?card) { card };
      };
      if (card.stock == 0) {
        Runtime.trap("Card out of stock: " # card.name);
      };
      let updatedCard = {
        id = card.id;
        priceInCents = card.priceInCents;
        name = card.name;
        description = card.description;
        rarity = card.rarity;
        imageId = card.imageId;
        stock = card.stock - 1;
        createdAt = card.createdAt;
      };
      cards.add(cardId, updatedCard);
    };

    let orderId = idMapToText(orders) # "-" # caller.toText();
    let createdAt = Time.now().toNat();
    orders.add(
      orderId,
      {
        id = orderId;
        buyer = caller;
        cardIds = cart.items;
        totalPrice = arraySum(cart.items.map(func(id) { switch (cards.get(id)) { case (null) { Runtime.trap("Card not found") }; case (?card) { card.priceInCents } } }));
        createdAt;
        shippingAddress;
        status = #pending;
        trackingNumber = null;
      },
    );
    carts.add(caller, { items = []; totalPrice = 0; createdAt });
    orderId;
  };

  public query ({ caller }) func getOrders(buyer : Principal) : async [OrderHistory] {
    if (caller != buyer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(order) { order.buyer == buyer }).sort(OrderHistory.compareByCreatedAt);
  };

  public query ({ caller }) func getAllOrders() : async [OrderHistory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort(OrderHistory.compareByMostRecent);
  };

  public shared ({ caller }) func updateOrderStatus(update : OrderHistoryUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = switch (orders.get(update.id)) {
      case (null) { Runtime.trap("Order not found: " # update.id) };
      case (?order) { order };
    };

    let updatedOrder = {
      order with
      status = update.status;
      trackingNumber = update.trackingNumber;
    };
    orders.add(update.id, updatedOrder);
  };

  // --------- Helper Functions ---------
  func arraySum(array : [Nat]) : Nat {
    var sum = 0;
    for (element in array.values()) {
      sum += element;
    };
    sum;
  };

  func idMapToText<T>(map : Map.Map<Text, T>) : Text {
    map.size().toText();
  };
};
