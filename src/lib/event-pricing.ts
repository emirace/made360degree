interface EventPricingInput {
  price?: number | null;
  earlyBirdFee?: number | null;
}

export function getEventPrice(event: EventPricingInput) {
  const earlyBirdFee =
    typeof event.earlyBirdFee === "number" && event.earlyBirdFee > 0
      ? event.earlyBirdFee
      : undefined;

  return {
    amount: earlyBirdFee ?? event.price ?? 0,
    regularPrice: event.price ?? 0,
    earlyBirdFee,
    hasEarlyBirdFee: earlyBirdFee !== undefined,
  };
}
