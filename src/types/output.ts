import { classObject } from "./class";
import { teacherObject } from "./teacher";

export interface finalOutput {
	oldSatisfaction: {
		sum: number;
		avg: number;
	};
	newSatisfaction: {
		sum: number;
		avg: number;
	};
	scenarios: scenario[];
}

export interface scenario {
	globalSatisfaction: {
		sum: number;
		avg: number;
	};
	classesSatisfaction: {
		sum: number;
		avg: number;
	};
	teachersSatisfaction: {
		sum: number;
		avg: number;
	};
	classes: classResult[];
	teachers: teacherResult[];
}

export interface classResult extends classObject {
	classSatisfaction: number;
}
export interface teacherResult extends teacherObject {
	teacherSatisfaction: number;
}
