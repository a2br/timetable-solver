import {
	teacherObject,
	classObject,
	uniqueId,
	scenario,
	timetable,
} from "../types";

export function findScenarios(
	timetable: timetable,
	teachers: teacherObject[],
	classes: classObject[],
	missingTeachers: uniqueId[],
	maxDepth = 10,
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
