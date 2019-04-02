export function name(n: string): string {
    const strArr: string[] = n.split("/");
    return strArr[strArr.length - 1];
}
