export function match(param: string): boolean {
	return /^20[0-9]{2}$/.test(param);
}
