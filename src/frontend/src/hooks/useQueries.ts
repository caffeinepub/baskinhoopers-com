import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Card,
  OrderHistory,
  OrderHistoryUpdate,
  ShippingAddress,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useCards() {
  const { actor, isFetching } = useActor();
  return useQuery<Card[]>({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCart(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cart", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getCart(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
    refetchInterval: 5000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.addToCart(cardId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFromCart(cardId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useDeleteCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCard(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (card: Card) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCard(card);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useMyOrders(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<OrderHistory[]>({
    queryKey: ["orders", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getOrders(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<OrderHistory[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (shippingAddress: ShippingAddress) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(shippingAddress);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (update: OrderHistoryUpdate) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(update);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOrders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
