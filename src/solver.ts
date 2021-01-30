import { Timetable } from "./classes";
import { entity, uniqueId } from "./types";
import { finalOutput } from "./types";
import { findScenarios } from "./util";

export function solveTimetables(
	timetable: Timetable,
	entities: entity[],
	missingEntities: uniqueId[]
): finalOutput {
	//TODO Get current satisfaction data
	const scenarios = findScenarios(timetable, entities, missingEntities, 100);
	// Get the highest satisfaction data of the first (best) scenario
	const newSatisfaction = scenarios[0].globalSatisfaction;

	return {
		oldSatisfaction: timetable.evalSatisfaction(),
		newSatisfaction,
		scenarios,
	};
}
