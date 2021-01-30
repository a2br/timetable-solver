import { classObject, teacherObject, uniqueId, timetable } from "./types";
import { finalOutput } from "./types";
import { findScenarios } from "./util";

export function solveTimetables(
	timetable: timetable,
	teachers: teacherObject[],
	classes: classObject[],
	missingTeachers: uniqueId[]
): finalOutput {
	//TODO Get current satisfaction data
	const scenarios = findScenarios(
		timetable,
		teachers,
		classes,
		missingTeachers,
		100
	);
	// Get the highest satisfaction data of the first (best) scenario
	const newSatisfaction = scenarios[0].globalSatisfaction;

	return {
		oldSatisfaction: {
			sum: 0,
			avg: 0,
		},
		newSatisfaction,
		scenarios,
	};
}
