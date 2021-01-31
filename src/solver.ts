import { Timetable } from "./classes";
import { entity, uniqueId } from "./types";
import { finalOutput } from "./types";
import { findScenarios } from "./util";

export function solveTimetables(
	timetable: Timetable,
	entities: entity[],
	missingEntities: uniqueId[]
): finalOutput {
	const oldSatisfaction = timetable.evalSatisfaction();
	const scenarios = findScenarios(timetable, entities, missingEntities, 100);
	const newSatisfaction = scenarios[0].globalSatisfaction;
	return {
		oldSatisfaction,
		newSatisfaction,
		scenarios,
	};
}
