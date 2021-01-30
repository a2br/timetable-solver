import { entity } from "./entity";
import { Event } from "../classes";

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
	entities: entityResult[];
	timetable: Event[];
}

export interface entityResult extends entity {
	satisfaction: number;
}
