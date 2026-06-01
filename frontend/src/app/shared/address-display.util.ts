export interface AddressDisplaySource {
  placeName?: string | null;
  landmark?: string | null;
  locality?: string | null;
  formattedAddress?: string | null;
  address?: string | null;
  name?: string | null;
}

const ADMINISTRATIVE_PARTS = /^(india|telangana|hyderabad|hyderabad district|rangareddy|ranga reddy|500\d{3})$/i;
const UNIT_LEVEL_PARTS = /^(plot|flat|floor|unit|door|house|h\.?\s*no|survey|sy\.?\s*no|building\s*no)\b/i;

export function getDisplayAddress(location: string | AddressDisplaySource | null | undefined, fallback = "Location"): string {
  if (!location) {
    return fallback;
  }

  if (typeof location === "string") {
    return shortenAddress(location, fallback);
  }

  const preferred = [
    location.placeName,
    location.landmark,
    location.name,
    location.locality
  ].map(normalizeAddress).find(Boolean);

  return preferred ?? shortenAddress(location.formattedAddress ?? location.address ?? "", fallback);
}

export function getDisplayRouteLabel(from: string, to: string, fallbackFrom = "Pickup", fallbackTo = "Destination"): string {
  return `${getDisplayAddress(from, fallbackFrom)} to ${getDisplayAddress(to, fallbackTo)}`;
}

function shortenAddress(value: string, fallback: string): string {
  const normalized = normalizeAddress(value);
  if (!normalized) {
    return fallback;
  }

  const airportName = normalized.match(/rajiv gandhi international airport|rgia airport|rgia|airport/i)?.[0];
  if (airportName) {
    return /rgia/i.test(airportName) ? "RGIA Airport" : "Rajiv Gandhi International Airport";
  }

  const parts = normalized
    .split(",")
    .map((part) => normalizeAddress(part))
    .filter((part): part is string => Boolean(part) && !ADMINISTRATIVE_PARTS.test(part));

  if (!parts.length) {
    return normalized;
  }

  const firstUsefulIndex = Math.max(0, parts.findIndex((part) => !UNIT_LEVEL_PARTS.test(part)));
  const usefulParts = parts.slice(firstUsefulIndex === -1 ? 0 : firstUsefulIndex);

  if (UNIT_LEVEL_PARTS.test(parts[0]) && usefulParts.length >= 2) {
    return usefulParts.slice(0, 2).join(", ");
  }

  return usefulParts[0] ?? parts[0] ?? fallback;
}

function normalizeAddress(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/\s*\n+\s*/g, ", ")
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,+/g, ",")
    .trim()
    .replace(/,$/, "");
}
