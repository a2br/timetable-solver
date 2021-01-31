import { uniqueId } from "../types";
import { Event } from "./event";
import { Line } from "./line";

export class Timetable {
	constructor(readonly events: Event[]) {}
	isAvailable(entity: uniqueId, at: Line): boolean {
		const available = isAvailable(entity, this, at);
		return available;
	}
	filter(entities: uniqueId[] | Set<uniqueId> | uniqueId): Timetable {
		entities = entities instanceof Set ? [...entities] : entities;
		const filtered = this.events.filter((event) =>
			Array.isArray(entities)
				? entities.some((entity) => event.entities.has(entity))
				: event.entities.has(entities as uniqueId)
		);
		const newTimetable = new Timetable(filtered);
		return newTimetable;
	}
	filterGroup(entities: uniqueId[] | Set<uniqueId>): Timetable {
		entities = [...entities];
		const filtered = this.events.filter((event) =>
			(entities as uniqueId[]).every((entity) => event.entities.has(entity))
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
	isValid(entities: uniqueId[]): boolean {
		const valid = this.filter(entities).events.every(
			(e) =>
				this.events
					.filter((ev) => ev.id !== e.id) // every event except the one being tested
					.every((ev) => !ev.conflictsWith(e)) // doesn't conflict with any other event
		);
		return valid;
	}
	private forceSwap = (a: Event | number, b: Event | number): Timetable => {
		if (typeof a === "number") {
			a = this.events[a];
			if (!a) throw new Error("Can't find event from its index!");
		}
		if (typeof b === "number") {
			b = this.events[b];
			if (!b) throw new Error("Can't find event from its index!");
		}
		const futureA = new Event(
			a.id,
			a.name,
			b.start,
			a.length,
			a.entities,
			a.empty,
			a.fixed
		);
		const futureB = new Event(
			b.id,
			b.name,
			a.start,
			b.length,
			b.entities,
			b.empty,
			b.fixed
		);
		const futureEvents = [...this.events].map((e) => {
			switch (e.id) {
				case futureA.id:
					return futureA;
				case futureB.id:
					return futureB;
				default:
					return e;
			}
		});
		const futureTimetable = new Timetable(futureEvents);
		return futureTimetable;
	};
	swappable(a: Event | number, b: Event | number): boolean {
		if (typeof a === "number") {
			a = this.events[a];
			if (!a) throw new Error("Can't find event from its index!");
		}
		if (typeof b === "number") {
			b = this.events[b];
			if (!b) throw new Error("Can't find event from its index!");
		}
		const futureTimetable = this.forceSwap(a, b);
		return futureTimetable.isValid([...a.entities, ...b.entities]);
	}
	swap(a: Event | number, b: Event | number): Timetable {
		if (typeof a === "number") {
			a = this.events[a];
			if (!a) throw new Error("Can't find event from its index!");
		}
		if (typeof b === "number") {
			b = this.events[b];
			if (!b) throw new Error("Can't find event from its index!");
		}
		if (!this.swappable(a, b))
			throw new Error("The two events are not swappable.");
		return this.forceSwap(a, b);
	}
	get length(): number {
		const nonEmpty = this.events.filter((e) => !e.empty);
		const startHour = nonEmpty.sort((a, b) => a.start - b.start)[0].start;
		const endHour = nonEmpty.sort((a, b) => b.end - a.end)[0].end;
		const dayLength = endHour - startHour;
		return dayLength;
	}
	merge(timetable: Timetable): Timetable {
		const extEvents = timetable.events;
		const newEvents = this.events.map(
			(oldE) => extEvents.find((extE) => extE.id === oldE.id) || oldE
		);
		const newTimetable = new Timetable(newEvents);
		return newTimetable;
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
