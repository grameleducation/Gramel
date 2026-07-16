export default async function tryCatch<T, E = Error>(
  fn: () => Promise<T>,
): Promise<[T, null] | [null, E]> {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}
