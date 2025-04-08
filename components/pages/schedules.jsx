import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
// Year, Month, Day, Hour, Minute
// January starts at 0
const events = [
	{
		title: "Season 2 Tip-Off",
		start: new Date(2025, 4, 3, 9, 0),
		end: new Date(2025, 4, 3, 17, 0)
	}
	// {
	// 	title: "Birthday",
	// 	start: new Date(2025, 3, 4, 0, 0),
	// 	end: new Date(2025, 3, 4, 23, 59, 59),
	// }
];

function Schedules() {
	return (
		<div className="container align-items-center justify-content-center">
			<div className="row">
				<div className="col">
					<h1>Schedule</h1>
				</div>
			</div>
			<div
				className="row rounded"
				style={{
					maxWidth: "80vw",
					backgroundColor: "#1B1827",
					padding: "10px 10px",
					color: "#DCDCDC",
				}}
			>
				<div className="col">
					<Calendar 
					style={{minHeight:"60vh"}}
					localizer={localizer} 
					events={events} 
					views={["month", "week", "day", "agenda"]}
					defaultView="month"/>
				</div>
			</div>
		</div>
	);
}

export default Schedules;
