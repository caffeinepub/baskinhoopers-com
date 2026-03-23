import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type OrderId = Text;

  type OldOrderHistory = {
    id : OrderId;
    buyer : Principal.Principal;
    cardIds : [Text];
    totalPrice : Nat;
    createdAt : Nat;
  };

  type OldActor = {
    cards : Map.Map<Text, Card>;
    carts : Map.Map<Principal.Principal, Cart>;
    orders : Map.Map<Text, OldOrderHistory>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
  };

  type Card = {
    id : Text;
    priceInCents : Nat;
    name : Text;
    description : Text;
    rarity : Text;
    imageId : Storage.ExternalBlob;
    stock : Nat;
    createdAt : Nat;
  };

  type Cart = {
    items : [Text];
    totalPrice : Nat;
    createdAt : Nat;
  };

  type UserProfile = {
    name : Text;
  };

  type ShippingAddress = {
    name : Text;
    email : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  type OrderStatus = {
    #pending;
    #printing;
    #shipped;
    #delivered;
  };

  type NewOrderHistory = {
    id : OrderId;
    buyer : Principal.Principal;
    cardIds : [Text];
    totalPrice : Nat;
    createdAt : Nat;
    shippingAddress : ShippingAddress;
    status : OrderStatus;
    trackingNumber : ?Text;
  };

  type NewActor = {
    cards : Map.Map<Text, Card>;
    carts : Map.Map<Principal.Principal, Cart>;
    orders : Map.Map<Text, NewOrderHistory>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<OrderId, OldOrderHistory, NewOrderHistory>(
      func(_orderId, oldOrder) {
        {
          oldOrder with
          shippingAddress = {
            name = oldOrder.buyer.toText();
            email = "";
            street = "";
            city = "";
            state = "";
            zip = "";
            country = "";
          };
          status = #pending;
          trackingNumber = null;
        };
      }
    );
    {
      old with
      orders = newOrders;
    };
  };
};
