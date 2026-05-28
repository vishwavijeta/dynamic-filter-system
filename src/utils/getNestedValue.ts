export const getNestedValue = (
    obj: Record<string, unknown>,
    path: string
) => {
    return path
        .split(".")
        .reduce<unknown>((acc, key) => {
            if (
                acc &&
                typeof acc === "object" &&
                key in acc
            ) {
                return (acc as Record<string, unknown>)[key];
            }

            return undefined;
        }, obj);
};
