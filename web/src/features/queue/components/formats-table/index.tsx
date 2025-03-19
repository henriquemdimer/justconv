import { FaAngleRight } from "react-icons/fa6";
import "./index.scss";
import { useState } from "react";
import { Reuleaux } from 'ldrs/react'
import { useLibState } from "@/lib/core/state/manager";
import { IFormatState } from "@/lib/core/app/app_state";
import { app } from "@/lib";
import { Format } from "@/lib/core/types/formats";

export interface FormatsTableProps {
    onSelect?: (format: string) => void;
}

export default function FormatsTable(props: FormatsTableProps) {
    const formats = useLibState<IFormatState>(app.state.reducers.formats);
    const data = formats.formats;
    const [selectedGroup, setSelectedGroup] = useState(data[0].type);

    return (
        <div className="formats-table">
            {!formats.loading ? (
                <>
                    <div className="formats-table__groups">
                        {data.length ? data.map((group) => (
                            <div onMouseEnter={() => setSelectedGroup(group.type)} className={`formats-table__groups__group ${selectedGroup === group.type ? "formats-table__groups__group--active" : ""}`}>
                                <span>{group.type}</span>
                                <i><FaAngleRight /></i>
                            </div>
                        )) : ""}
                    </div>
                    <div className="formats-table__formats">
                        {data.length ? data.find((g) => g.type === selectedGroup)?.formats.map((format: Format) => (
                            <div onClick={() => props.onSelect?.(format.name)} className="formats-table__formats__format">{format.name}</div>
                        )) : ""}
                    </div>
                </>
            ) : (
                <div className="formats-table__loader">
                    <i>
                        <Reuleaux
                            size="37"
                            stroke="5"
                            stroke-length="0.15"
                            bg-opacity="0.5"
                            speed="1.2"
                            color="var(--primary)"
                        />
                    </i>
                </div>
            )}
        </div >
    )
}