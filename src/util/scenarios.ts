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
	//TODO Get best scenario

	//TODO Find blank spots
	//TODO Edit blank spots: delete missing entity, mark as empty
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
		//TODO Find non-empty events with the same entities
		const planning = new Timetable(events).filterGroup(event.entities);
		//TODO Try to swap with these events (the chronologically first, then the last)
	});
	//TODO For each entity, find the first/last non-empty event of the day, check if it's okay
	//TODO If it isn't, do the same thing with the others entity, until it works
	//TODO If it doesn't, don't move
	const scenario: scenario = {};
	const scenarios = [
		scenario,
		...findScenarios(timetable, entities, missingEntities, maxDepth, depth + 1),
	].sort((a, b) => a.globalSatisfaction.sum - b.globalSatisfaction.sum);
	return scenarios;
}
