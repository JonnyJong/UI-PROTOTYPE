import t from "io-ts";

export type SettingsErrorCode = 'INVALID_KEY' | 'INVALID_VALUE';

export type SerializedData = string | number | boolean | null | SerializedData[] | { [key: string]: SerializedData };

export type Serializers = { [key in keyof SettingsKeyMap]?: (value: SettingsKeyMap[key])=>SerializedData };
export type Deserializers = { [key in keyof SettingsKeyMap]?: (value: SerializedData)=>SettingsKeyMap[key] };

export type Validators = { [key in keyof SettingsKeyMap]: t.Type<SettingsKeyMap[key]> };

export interface SettingsKeyMap {
  languages: string[],
  color: string,
  theme: 'system' | 'light' | 'dark',
}
