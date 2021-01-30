import { entity, uniqueId, scenario } from "../types";
import { Event, Timetable } from "../classes";

export function findScenarios(
	timetable: Timetable,
	entities: entity[],
	missingEntities: uniqueId[],
	maxDepth = 100,
	depth = 1
): scenario[] {
	if (depth > maxDepth) return [];
	let scenarios: scenario[] = [];

	//TODO Get best scenario in function of everyone's satisfaction

	//TODO Mix it with branches
	// scenarios = [
	// 	scenario,
	// 	...findScenarios(timetable, teachers, classes, missingTeachers, maxDepth, depth + 1),
	// ].sort((a, b) => a.globalSatisfaction.sum - b.globalSatisfaction.sum);
	return scenarios;
}
