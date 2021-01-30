import { uniqueId } from "../types";
import { Event } from "./event";
import { Line } from "./line";

export class Timetable {
	constructor(public events: Event[]) {}
	isAvailable(entity: uniqueId, at: Line): boolean {
		const available = isAvailable(entity, this, at);
		return available;
	}
	filter(entities: uniqueId[] | uniqueId): Timetable {
		const filtered = this.events.filter((event) =>
			Array.isArray(entities)
				? entities.some((entity) => event.entities.has(entity))
				: event.entities.has(entities)
		);
		const newTimetable = new Timetable(filtered);
		return newTimetable;
	}
	//TODO SELECT BY ID, OR TAG (with entities index)
	evalSatisfaction(entities?: uniqueId[] | uniqueId): number {
		const target = entities ? this.filter(entities) : this;
		const points = 100;
		// Add trimBonus
		// Sub gapMalus
		return points;
	}
}

function isAvailable(
	entityId: uniqueId,
	timetable: Timetable,
	eventLine: Line
): boolean {
	const t = timetable.filter(entityId);
	const available = t.events.every((e) => !e.conflictsWith(eventLine));
	return available;
}
