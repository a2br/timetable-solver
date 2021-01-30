import { uniqueId } from "../types";
import { Line } from "./line";

export class Event {
	private _length: number;

	constructor(
		readonly id: uniqueId,
		readonly name: string,
		public start: number,
		length: number,
		public entities: Set<uniqueId>,
		public empty?: boolean,
		public fixed?: boolean
	) {
		this._length = length;
		new Line(this.start, this.end);
	}
	get length() {
		return this._length;
	}
	set length(newValue: number) {
		if (length < 0) throw new Error();
		this._length = newValue;
	}
	get end() {
		return this.start + this.length;
	}

	getLine(): Line {
		return new Line(this.start, this.end);
	}
	conflictsWith(thing: Event | Line): boolean {
		if (thing instanceof Event) return this.conflictsWith(thing.getLine());
		return thing.conflictsWith(this.getLine());
	}
}
