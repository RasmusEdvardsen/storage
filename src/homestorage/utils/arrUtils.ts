export function name(name: string): string {
    const strArr: string[] = name.split("/");
    return strArr[strArr.length - 1];
}
