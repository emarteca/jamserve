export function slugify(s: string): string {
	return s.replace(/[[\]. -]/g, '').toLowerCase();
}
