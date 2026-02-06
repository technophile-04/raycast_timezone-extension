/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Favorite Timezones - Comma-separated list of timezones to always show (e.g., America/New_York, CET, Tokyo) */
  "favoriteTimezones": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `convert-time` command */
  export type ConvertTime = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `convert-time` command */
  export type ConvertTime = {}
}

