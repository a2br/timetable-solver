import { uniqueId } from "../types";
import { Line } from "./line";

export class Event {
	public end: number;

	constructor(
		public id: uniqueId,
		public name: string,
		public start: number,
		public length: number,
		public entities: Set<uniqueId>,
		public empty?: boolean,
		public fixed?: boolean
	) {
		this.end = this.start + this.length;
		new Line(this.start, this.end);
	}
	getLine() {
		return new Line(this.start, this.end);
	}
	conflictsWith(thing: Event | Line): boolean {
		if (thing instanceof Event) return this.conflictsWith(thing.getLine());
		return thing.conflictsWith(this.getLine());
	}
}
