import {
  Action,
  ActionPanel,
  Color,
  getPreferenceValues,
  Icon,
  LaunchProps,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect } from "react";
import {
  convertTime,
  getDisambiguationLabel,
  getInvalidFavorites,
  getTargetTimezones,
  parseQuery,
} from "./timezone-utils";
import type { ConvertedTime } from "./timezone-utils";

interface Preferences {
  favoriteTimezones: string;
}

export default function ConvertTime(
  props: LaunchProps<{ arguments: { query: string } }>,
) {
  const { query } = props.arguments;
  const { favoriteTimezones } = getPreferenceValues<Preferences>();
  const parsed = parseQuery(query);

  // Show toast for invalid favorites
  useEffect(() => {
    const invalid = getInvalidFavorites(favoriteTimezones);
    if (invalid.length > 0) {
      showToast({
        style: Toast.Style.Warning,
        title: "Skipping unknown timezone(s)",
        message: invalid.join(", "),
      });
    }
  }, [favoriteTimezones]);

  if (parsed.error) {
    return (
      <List>
        <List.EmptyView
          title="Couldn't parse your input"
          description={parsed.error}
          icon={Icon.ExclamationMark}
        />
      </List>
    );
  }

  const targets = getTargetTimezones(parsed, favoriteTimezones);
  const results = targets.map((tz) =>
    convertTime(
      parsed.hours,
      parsed.minutes,
      parsed.sourceTimezone,
      tz.ianaId,
      tz.label || getDisambiguationLabel(tz.ianaId, parsed.sourceLabel),
    ),
  );

  const allConversionsText = results
    .map((r) => `${r.formattedTime} ${r.abbreviation}`)
    .join(" = ");

  return (
    <List>
      <List.Section title={`${parsed.timeStr} ${parsed.sourceLabel}`}>
        {results.map((result) => (
          <List.Item
            key={result.ianaId + (result.label || "")}
            icon={result.isLocal ? Icon.House : Icon.Globe}
            title={`${result.formattedTime} ${result.abbreviation}`}
            subtitle={result.label || result.ianaId}
            accessories={buildAccessories(result)}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard
                  title="Copy Time"
                  content={`${result.formattedTime} ${result.abbreviation}`}
                />
                <Action.CopyToClipboard
                  title="Copy Time Only"
                  content={result.formattedTime}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                />
                <Action.CopyToClipboard
                  title="Copy All Conversions"
                  content={allConversionsText}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "a" }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

function buildAccessories(result: ConvertedTime): List.Item.Accessory[] {
  const accessories: List.Item.Accessory[] = [
    { text: `UTC${result.utcOffset}` },
  ];
  if (result.isLocal) {
    accessories.push({ tag: { value: "Local", color: Color.Green } });
  }
  if (result.dayOffset !== 0) {
    const label =
      result.dayOffset > 0
        ? `+${result.dayOffset} day`
        : `${result.dayOffset} day`;
    accessories.push({ tag: { value: label, color: Color.Orange } });
  }
  return accessories;
}
