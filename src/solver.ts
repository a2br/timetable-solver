import { classObject, teacherObject, uniqueId } from "./types";
import { finalOutput } from "./types";
import { evalEntitySatisfaction, findScenarios } from "./util";

export function solveTimetables(
	teachers: teacherObject[],
	classes: classObject[],
	missingTeachers: uniqueId[]
): finalOutput {
	const [oldSum, oldAvg] = evalEntitySatisfaction([...teachers, ...classes]);
	const scenarios = findScenarios(teachers, classes, missingTeachers, 100);
	const newSatisfaction = scenarios[0].globalSatisfaction;
	// spot blank spots left by missing teachers
	// try to fill them (starting with the last elem of the day) except if it's the first non-empty elem / last elem
	// try different combinations if there are many (recursivity: try all combinations after moving THESE courses and ...)
	// put them in an array of possible scenarios
	// sort it by satisfaction and return it
	return {
		oldSatisfaction: {
			sum: oldSum,
			avg: oldAvg,
		},
		newSatisfaction,
		scenarios,
	};
}
