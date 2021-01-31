import { entity, uniqueId, scenario } from "../types";
import { Timetable } from "../classes";

export function findScenarios(
	timetable: Timetable,
	entities: entity[],
	missingEntities: uniqueId[],
	maxDepth = 100,
	depth = 1
): scenario[] {
	if (depth > maxDepth) return [];

	const events = [...timetable.events].map((e) => {
		if (!missingEntities.some((mE) => e.entities.has(mE))) return e;
		e.empty = true;
		missingEntities.forEach(
			(mE) => e.entities.has(mE) && e.entities.delete(mE)
		);
		return e;
	});
	const emptyEvents = events.filter((e) => !!e.empty);
	emptyEvents.forEach((event, index) => {
		//? Find non-empty events with the same entities
		const planning = new Timetable(events).filterGroup(event.entities);
		const nonEmptyPlusThis = new Timetable(
			events.filter((e) => !e.empty || e.id === event.id)
		).filterGroup(event.entities);

		// Find the first/last non-empty event
		const firstNonEmpty = planning.events.sort((a, b) => a.start - b.start)[0];
		const lastNonEmpty = planning.events.sort((a, b) => b.start - a.start)[0];

		// Special case
		const sndLastNonEmpty =
			nonEmptyPlusThis.events.slice(index + 1).length === 1;

		if (sndLastNonEmpty && planning.swappable(event, lastNonEmpty)) {
			timetable = timetable.merge(planning.swap(event, lastNonEmpty));
		} else if (planning.swappable(event, firstNonEmpty)) {
			timetable = timetable.merge(planning.swap(event, firstNonEmpty));
		} else if (planning.swappable(event, lastNonEmpty)) {
			timetable = timetable.merge(planning.swap(event, lastNonEmpty));
		}
	});
	const scenario: scenario = {
		globalSatisfaction: timetable.evalSatisfaction(),
		entities: entities.map((e) => ({
			id: e.id,
			name: e.name,
			tags: e.tags,
			satisfaction: timetable.evalSatisfaction(e.id),
		})),
		timetable,
	};
	const scenarios = [
		scenario,
		...findScenarios(timetable, entities, missingEntities, maxDepth, depth + 1),
	].sort((a, b) => a.globalSatisfaction - b.globalSatisfaction);
	return scenarios;
}
