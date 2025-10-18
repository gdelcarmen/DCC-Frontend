import { Badge, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import type { ChangeEvent, JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ObjectInputProps, set, unset } from "sanity";

type CoordinateKey = "lat" | "lng";

type CoordinateValue = {
  _type?: string;
  lat?: number;
  lng?: number;
};

type DraftValue = {
  lat: string;
  lng: string;
};

const isWithinRange = (key: CoordinateKey, value: number): boolean => {
  if (key === "lat") {
    return value >= -90 && value <= 90;
  }
  return value >= -180 && value <= 180;
};

const formatCoordinate = (value: number): string => value.toFixed(5);

const getPreviewUrl = (lat: number, lng: number): string =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=11/${lat}/${lng}`;

const getBaseDraft = (value?: CoordinateValue): DraftValue => ({
  lat: typeof value?.lat === "number" ? value.lat.toString() : "",
  lng: typeof value?.lng === "number" ? value.lng.toString() : ""
});

const GeoCoordinateInput = (props: ObjectInputProps<CoordinateValue>): JSX.Element => {
  const { value, schemaType, onChange, readOnly, elementProps } = props;
  const [draft, setDraft] = useState<DraftValue>(() => getBaseDraft(value));

  const typeName =
    schemaType.name && schemaType.name !== "object" ? schemaType.name : undefined;

  useEffect(() => {
    setDraft((prev: DraftValue) => {
      const next = getBaseDraft(value);
      if (prev.lat === next.lat && prev.lng === next.lng) {
        return prev;
      }
      return next;
    });
  }, [value?.lat, value?.lng]);

  const createBaseValue = useCallback((): CoordinateValue => {
    const next: CoordinateValue = { ...(value ?? {}) };
    if (typeName) {
      next._type = typeName;
    }
    return next;
  }, [typeName, value]);

  const clearCoordinate = useCallback(
    (key: CoordinateKey) => {
      const next = createBaseValue();
      delete next[key];
      const otherKey: CoordinateKey = key === "lat" ? "lng" : "lat";
      if (typeof next[otherKey] !== "number") {
        onChange(unset());
      } else {
        onChange(set(next));
      }
    },
    [createBaseValue, onChange]
  );

  const handleCoordinateChange = useCallback(
    (key: CoordinateKey, nextValue: string) => {
      setDraft((prev: DraftValue) => ({ ...prev, [key]: nextValue }));

      const trimmed = nextValue.trim();

      if (!trimmed) {
        clearCoordinate(key);
        return;
      }

      const numeric = Number.parseFloat(trimmed);
      if (!Number.isFinite(numeric) || !isWithinRange(key, numeric)) {
        return;
      }

      const next = createBaseValue();
      next[key] = numeric;
      onChange(set(next));
    },
    [clearCoordinate, createBaseValue, onChange]
  );

  const latTrimmed = draft.lat.trim();
  const lngTrimmed = draft.lng.trim();

  const latNumeric = Number.parseFloat(latTrimmed);
  const lngNumeric = Number.parseFloat(lngTrimmed);

  const latHasInput = Boolean(latTrimmed);
  const lngHasInput = Boolean(lngTrimmed);

  const latIsNumber = latHasInput && Number.isFinite(latNumeric);
  const lngIsNumber = lngHasInput && Number.isFinite(lngNumeric);

  const latInRange = latIsNumber && isWithinRange("lat", latNumeric);
  const lngInRange = lngIsNumber && isWithinRange("lng", lngNumeric);

  const latError = latHasInput && (!latIsNumber || !latInRange);
  const lngError = lngHasInput && (!lngIsNumber || !lngInRange);

  const parsedLat = latIsNumber && latInRange ? latNumeric : undefined;
  const parsedLng = lngIsNumber && lngInRange ? lngNumeric : undefined;

  const hasBothCoordinates = typeof parsedLat === "number" && typeof parsedLng === "number";
  const previewUrl = useMemo(() => {
    if (!hasBothCoordinates) {
      return undefined;
    }
    return getPreviewUrl(parsedLat, parsedLng);
  }, [hasBothCoordinates, parsedLat, parsedLng]);

  const statusTone = useMemo(() => {
    if (latError || lngError) {
      return "critical";
    }
    if (hasBothCoordinates) {
      return "positive";
    }
    if (latHasInput || lngHasInput) {
      return "caution";
    }
    return "default";
  }, [hasBothCoordinates, latError, latHasInput, lngError, lngHasInput]);

  return (
    <Stack space={3}>
      <Flex gap={3}>
        <Stack flex={1} space={2}>
          <Text size={1} weight="semibold">
            Latitude
          </Text>
          <TextInput
            {...elementProps}
            type="number"
            value={draft.lat}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleCoordinateChange("lat", event.currentTarget.value)
            }
            readOnly={readOnly}
            step="0.00001"
            min={-90}
            max={90}
          />
          <Text muted size={1}>
            Accepts values between -90 and 90.
          </Text>
        </Stack>
        <Stack flex={1} space={2}>
          <Text size={1} weight="semibold">
            Longitude
          </Text>
          <TextInput
            type="number"
            value={draft.lng}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleCoordinateChange("lng", event.currentTarget.value)
            }
            readOnly={readOnly}
            step="0.00001"
            min={-180}
            max={180}
          />
          <Text muted size={1}>
            Accepts values between -180 and 180.
          </Text>
        </Stack>
      </Flex>

      <Card tone={statusTone} padding={3} radius={2} border>
        <Stack space={2}>
          <Flex align="center" gap={2}>
            <Text weight="semibold">Map preview</Text>
            {hasBothCoordinates ? (
              <Badge tone="positive" mode="outline">
                Ready
              </Badge>
            ) : (
              <Badge tone="caution" mode="outline">
                Coordinates needed
              </Badge>
            )}
          </Flex>
          {latError && (
            <Text size={1}>
              Latitude must be a number between -90 and 90.
            </Text>
          )}
          {lngError && (
            <Text size={1}>
              Longitude must be a number between -180 and 180.
            </Text>
          )}
          {!latError && !lngError && hasBothCoordinates && previewUrl && (
            <Stack space={1}>
              <Text size={1} muted>
                {formatCoordinate(parsedLat)}°, {formatCoordinate(parsedLng)}°
              </Text>
              <Text size={1}>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  Open in OpenStreetMap
                </a>
              </Text>
            </Stack>
          )}
          {!latError && !lngError && !hasBothCoordinates && (latHasInput || lngHasInput) && (
            <Text size={1}>
              Provide both latitude and longitude to generate a preview link.
            </Text>
          )}
          {!latHasInput && !lngHasInput && (
            <Text size={1}>Enter coordinates to display this agency on the public map.</Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default GeoCoordinateInput;
