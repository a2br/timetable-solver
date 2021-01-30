import { uniqueId } from "../types";
import { Line } from "./line";

export class Event {
	readonly end: number;

	constructor(
		readonly id: uniqueId,
		readonly name: string,
		readonly start: number,
		readonly length: number,
		readonly entities: Set<uniqueId>,
		readonly empty?: boolean,
		readonly fixed?: boolean
	) {
		this.end = this.start + this.length;
		new Line(this.start, this.end);
	}
	getLine(): Line {
		return new Line(this.start, this.end);
	}
	conflictsWith(thing: Event | Line): boolean {
		if (thing instanceof Event) return this.conflictsWith(thing.getLine());
		return thing.conflictsWith(this.getLine());
	}
}
