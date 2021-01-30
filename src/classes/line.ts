interface lineParams {
	start: number;
	end: number;
}

export class Line {
	constructor(public start: number, public end: number) {
		if (start > end) throw new Error("A line's length can't be negative");
	}
	conflictsWith(line: Line): boolean {
		const conflict = isConflict(this, line);
		return conflict;
	}
	distanceTo(line: Line): number {
		const distance = distanceBetween(this, line);
		return distance;
	}
}

export function isConflict(a: Line, b: Line): boolean {
	const bInA =
		a.start <= b.start && b.end <= a.end && a.start < b.end && b.start < a.end;
	const bOnA =
		b.start < a.start && b.end <= a.end && a.start < b.end && b.start < a.end;
	const aOnB =
		a.start <= b.start && a.end < b.end && a.start < b.end && b.start < a.end;
	const aInB =
		b.start <= a.start && a.end <= b.end && a.start < b.end && b.start < a.end;
	const conflict = bInA || aInB || bOnA || aOnB;
	return conflict;
}

export function distanceBetween(a: Line, b: Line): number {
	if (isConflict(a, b)) return 0;
	if (a.start < b.start) return b.start - a.end;
	if (a.start > b.start) return a.start - b.end;
	throw new Error(
		"This error shouldn't appear. If it does, it means that the conflict detection has failed!"
	);
}
