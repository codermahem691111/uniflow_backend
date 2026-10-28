import { Transform } from 'class-transformer';

type StringTransform = (value: string) => string;

const applyToStrings = (transform: StringTransform) =>
  Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? transform(value) : value));

/** Removes leading and trailing whitespace before validation runs. */
export const Trim = () => applyToStrings((value) => value.trim());

/** Lower-cases the value (use together with @Trim for emails). */
export const Lowercase = () => applyToStrings((value) => value.toLowerCase());

/** Turns an empty or blank string into `null`, so optional fields can be cleared. */
export const EmptyToNull = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim() === '' ? null : value,
  );

/** Upper-cases the value (use together with @Trim for license numbers). */
export const Uppercase = () => applyToStrings((value) => value.toUpperCase());
