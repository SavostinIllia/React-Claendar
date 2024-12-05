import React from "react";
import { CreateDateReturnType, Holiday } from "../../../types";
import { CalendarDayTaskSetter } from "./CalendarDayTaskSetter";
import { useCalendarDayTasksContext } from "../../../context";
import { TaskItem } from "./TaskItem";
import { createDate } from "../../../utils/helpers/date";

interface RightBoardCalendarProps {
    selectedDate: CreateDateReturnType;
    holidayInformation?: Holiday;
    dateRangeWithHolidays?: Holiday[] | undefined;
    dateRangeWithTasks?: CreateDateReturnType[] | undefined;
    selectedDateRange: {
        dateStartRange: ReturnType<typeof createDate> | null;
        endDate: ReturnType<typeof createDate> | null;
    };
    dateGetRange: Date[];
}

export const RightBoard = ({
    selectedDate,
    holidayInformation,
    dateRangeWithHolidays,
    selectedDateRange,
    dateGetRange,
}: RightBoardCalendarProps) => {
    const { dayWithTask } = useCalendarDayTasksContext();

    const tasksInDateRange = React.useMemo(() => {

        if (
            !dayWithTask ||
            dayWithTask.length === 0 ||
            !selectedDateRange.dateStartRange ||
            !selectedDateRange.endDate ||
            dateGetRange.length === 0
        ) {
            return [];
        }

        return dateGetRange.reduce<CreateDateReturnType[]>((acc, day) => {
            const matchingTask = dayWithTask.find(
                (task) =>
                    `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(
                        day.getDate()
                    ).padStart(2, "0")}` === task.iso
            );
            if (matchingTask) {
                acc.push(matchingTask);
            }
            return acc;
        }, []);
    }, [dateGetRange, selectedDateRange, dayWithTask]);

    const holidaysInDateRange = React.useMemo(() => {
        if (!dateRangeWithHolidays?.length) return null;
        
        return (
            <div className="mb-[20px]">
                <h3 className="holliday__text text-violet text-4xl mb-4">Holiday this day's</h3>
                <ul className="list__wrapper relative h-auto overflow-y-auto pr-2 py-2">
                    {dateRangeWithHolidays.map((holiday) => (
                        <li
                            key={holiday.date.iso}
                            className="bg-black/[0.1] rounded-lg py-[5px] px-[10px] mb-4 text-xl text-txt-color"
                        >
                            {holiday.date.iso.split("T")[0]}: {holiday.name}
                        </li>
                    ))}
                </ul>
            </div>
        );

        
    }, [dateRangeWithHolidays]);


    const renderDayTasks = React.useMemo(() => {
        const todayTasks = dayWithTask.find((day) => day.iso === selectedDate.iso);

        if (!todayTasks?.tasksListFortheDay?.length) return null;

        return (
            <div className='task__wrapper relative h-auto'>
                <h3 className="taskslist__text text-turquoise text-3xl mb-2 pb-3 flex justify-between"> Event's for Today - {todayTasks.tasksListFortheDay.length}</h3>
                <ul className={`${holidaysInDateRange ? 'max-h-[600px]' : 'max-h-[390px]'} list__wrapper overflow-y-auto pr-2 mb-3 `}>
                    {todayTasks.tasksListFortheDay.map((task) => (
                    <li key={task.id} className="task__item flex basis-full text-txt-color w-full justify-start gap-[10px] mb-5 py-[5px] px-[10px] bg-black/[0.1] rounded-lg z-10 last:mb-0">
                        <TaskItem  task={task} day={todayTasks} />
                    </li>
                    ))}
                </ul>
            </div>
        );
    }, [dayWithTask, selectedDate, holidayInformation]);

    const renderTasksInDateRange = React.useMemo(() => {
        if (!tasksInDateRange.length) return;
       
        const eventsCount : number = tasksInDateRange.reduce((acc, day)  => {
            return acc += (day.tasksListFortheDay ? day.tasksListFortheDay.length : 0);
        }, 0)

        return (
            <div className='task__wrapper h-auto overflow-y-auto'>
                <h3 className="taskslist__text text-turquoise text-3xl mb-2 pb-3 flex justify-between">Event's in range - {eventsCount}</h3>
                <div className="h-auto max-h-[500px]">
                {tasksInDateRange.map((day) => (
                    <ul className="h-full max-h-[600px] pr-2 mb-4" key={day.iso}>
                    <>
                        <p className="text-txt-color text-2xl mb-2">{day.iso}</p>
                        {day.tasksListFortheDay?.map((task) => (
                            <li className="task__item ml-2 flex basis-full text-txt-color w-full justify-start gap-[10px] mb-5 py-[5px] px-[10px] bg-black/[0.1] rounded-lg z-10 last:mb-0"
                                key={task.id}>
                                <TaskItem  task={task} day={day} />
                            </li>
                        ))}
                    </>
                    </ul>
                ))}
                </div>
                
            </div>
        );
    }, [tasksInDateRange]);

    return (
        <div className="w-2/5 self-stretch mx-[20px] mt-[20px] mb-3 relative">
            <div className="text-center text-txt-color mb-4">
                {selectedDateRange.dateStartRange && selectedDateRange.endDate ? (
                    <div className="flex justify-center items-center gap-4">
                        <h1 className="text-[55px] leading-none">
                            {selectedDateRange.dateStartRange.dayNumber}{" "}
                            {selectedDateRange.dateStartRange.dayShort}
                            <p className="text-base leading-none">
                                {selectedDateRange.dateStartRange.monthShort}
                            </p>
                        </h1>
                        <span className="text-[55px]">-</span>
                        <h1 className="text-[55px] leading-none">
                            {selectedDateRange.endDate.dayNumber}{" "}
                            {selectedDateRange.endDate.dayShort}
                            <p className="text-xl leading-none">
                                {selectedDateRange.endDate.monthShort}
                            </p>
                        </h1>
                    </div>
                ) : (
                    <>
                        <h1 className="text-[130px] leading-none">{selectedDate.dayNumber}</h1>
                        <h2 className="text-3xl">{selectedDate.day}</h2>
                    </>
                )}
            </div>

            {holidaysInDateRange ||
                (holidayInformation?.name && (
                    <div className="text-txt-color mb-5">
                        <h3 className="holliday__text text-violet text-4xl mb-4">Holiday this day</h3>
                        <p className="bg-black/[0.1] rounded-lg py-[5px] px-[10px] text-xl">
                            {holidayInformation.name}
                        </p>
                    </div>
                ))}

            {renderTasksInDateRange || renderDayTasks}

            {!selectedDateRange.dateStartRange && !selectedDateRange.endDate && (
                <CalendarDayTaskSetter />
            )}
        </div>
    );
};
