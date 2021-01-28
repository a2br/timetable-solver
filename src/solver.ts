import { classObject, teacherObject, uniqueId } from "./types";
import { evalGlobalSatisfaction, evalSatisfaction } from "./util";

export function solveTimetables(
	teachers: teacherObject[],
	classes: classObject[],
	missingTeachers: uniqueId[],
	options?: {}
) {
	const originalSatisfaction = evalGlobalSatisfaction(teachers, classes);
	// spot blank spots left by missing teachers
	// try to fill them except if it's the first elem / last elem
	// try different combinations if there are many
	// put them in an array of possible scenarios
	// sort it by satisfaction and return it
	missingTeachers.forEach((mTeacherId) => {
		// do stuff
	});
}
