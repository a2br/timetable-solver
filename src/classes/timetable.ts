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
	evalSatisfaction(entities?: uniqueId[] | uniqueId): number {
		const target = entities ? this.filter(entities) : this;
		const satisfaction = evalSatisfaction(target);
		return satisfaction;
	}
	isValid(entities?: uniqueId[]): boolean {
		const target =
			entities && entities !== [] ? this.filter(entities).events : this.events;
		const valid = target.every(
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

//TODO SELECT BY ID, OR TAG (with entities index)
function evalSatisfaction(timetable: Timetable): number {
	if (!timetable.isValid())
		throw new Error("Cannot evaluate invalid timetable");
	let points = 100;
	points += evalTrimBonus(timetable);
	points += evalGapMalus(timetable);
	return points;
}

function evalTrimBonus(timetable: Timetable): number {
	let satis = 0;
	if (!timetable.isValid())
		throw new Error("Cannot evaluate invalid timetable");
	//? Eval day length
	const { length } = timetable;
	satis += (1 / length) * 1000;
	//? Eval trimmed empty events number
	const NotEmpty = {};
	// First hours of the day
	try {
		timetable.events.forEach((e) => {
			if (!e.empty) throw NotEmpty;
			// Add points until a non-empty event is found
			satis += 2 * ((1 / length) * 1000);
		});
	} catch (err) {
		if (err !== NotEmpty) throw err;
	}
	// Last hours of the day
	try {
		timetable.events.forEach((e, i, a) => {
			const l = a[a.length - 1 - i];
			if (!l.empty) throw NotEmpty;
			// Add points until a non-empty event is found
			satis += 1 * ((1 / length) * 1000);
		});
	} catch (err) {
		if (err !== NotEmpty) throw err;
	}
	return satis;
}
function evalGapMalus(timetable: Timetable): number {
	if (!timetable.isValid())
		throw new Error("Cannot evaluate invalid timetable");
	let satis = 0;
	timetable.events.forEach((e, i, a) => {
		const [before, after] = [a[i - 1], a[i + 1]];
		const firstHalf = i <= a.length / 2;
		const lastHalf = i > a.length / 2;
		if (firstHalf && after.empty) satis -= 10;
		if (lastHalf && before.empty) satis -= 10;
	});
	return satis;
	//TODO Eval how many gaps there is in the timetable
}
